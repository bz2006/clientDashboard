import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a function to generate the report
export const generateTripReport = (reports, essentials, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a modern PDF document
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: { top: 30, bottom: 30, left: 30, right: 30 },
        bufferPages: true // Enable buffer pages for dynamic footer positioning
      });

      // Create write stream
      const stream = fs.createWriteStream(outputPath);
      
      // Handle stream events
      stream.on('finish', () => {
        resolve(outputPath);
      });
      
      stream.on('error', (err) => {
        reject(err);
      });

      // Pipe the PDF to the file
      doc.pipe(stream);
      
      // Set up reusable styles
      const styles = {
        colors: {
          primary: '#000000',
          secondary: '#5D89E8',
          accent: '#FF8A00',
          lightBlue: '#FFFCF8',  // Light blue with low opacity
          dark: '#333333',
          border: '#E0E0E0'
        },
        fonts: {
          title: 'Helvetica-Bold',
          subtitle: 'Helvetica',
          header: 'Helvetica-Bold',
          body: 'Helvetica'
        }
      };

      // Helper function to calculate text height
      const calculateTextHeight = (text, fontSize, fontFamily, width) => {
        if (!text) return 0;
        doc.fontSize(fontSize).font(fontFamily);
        return doc.heightOfString(text.toString(), { width });
      };

      // Helper function to draw table with dynamic row heights
      const drawTable = (data, startY, rowLimit) => {
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        
        // Define column widths as percentages of available space
        const colWidthPercentages = [
          5,     // Sl No
          10,    // Start Time & Date
          10,    // Stop Time & Date
          7,     // Duration
          20,    // Start Location
          20,    // Stop Location
          7,     // Start KM
          7,     // Stop KM
          7,     // Distance
          7      // Speed Info
        ];
        
        // Convert percentages to actual widths
        const scaledWidths = colWidthPercentages.map(percentage => (pageWidth * percentage) / 100);
        
        // Table header
        const headers = [
          'Sl No', 'Start Time & Date', 'Stop Time & Date', 'Duration',
          'Start Location', 'Stop Location', 'Start KM', 'Stop KM', 'Distance', 'Speed Info'
        ];
        
        let y = startY;
        let headerHeight = 30;
        
        // Draw header row with light blue background (low opacity)
        doc.rect(doc.page.margins.left, y, pageWidth, headerHeight)
           .fillAndStroke(styles.colors.lightBlue, styles.colors.border);
        
        let x = doc.page.margins.left;
        
        headers.forEach((header, i) => {
          doc.font(styles.fonts.header).fontSize(10).fillColor(styles.colors.dark)
             .text(header, x + 5, y + 7, { width: scaledWidths[i] - 10, align: 'center' });
          x += scaledWidths[i];
        });
        
        y += headerHeight;
        
        // Track rows that were actually drawn
        let rowsDrawn = 0;
        
        // Draw data rows with dynamic heights
        const end = Math.min(rowLimit, data.length);
        
        for (let i = 0; i < end; i++) {
          const row = data[i];
          let maxRowHeight = 0;
          
          // Calculate the maximum height needed for this row
          x = doc.page.margins.left;
          const values = [
            row.slNo, 
            row.startTD, 
            row.stopTD, 
            row.duration, 
            row.startLocation, 
            row.stopLocation, 
            row.startKm, 
            row.stopKm, 
            row.distance + ' km', 
            row.speedInfo
          ];
          
          // Calculate height for each cell and find the maximum
          values.forEach((value, j) => {
            const textHeight = calculateTextHeight(value?.toString() || '', 10, styles.fonts.body, scaledWidths[j] - 10);
            const cellHeight = textHeight + 14; // Add padding
            maxRowHeight = Math.max(maxRowHeight, cellHeight);
          });
          
          maxRowHeight = Math.max(maxRowHeight, 30); // Minimum row height
          
          // Check if this row will fit on the current page
          if (y + maxRowHeight > doc.page.height - doc.page.margins.bottom - 40) {
            break; // This row won't fit, so stop
          }
          
          // Draw cell contents
          x = doc.page.margins.left;
          values.forEach((value, j) => {
            // Draw cell borders
            doc.rect(x, y, scaledWidths[j], maxRowHeight)
               .stroke(styles.colors.border);
            
            // Draw text
            doc.font(styles.fonts.body).fontSize(10).fillColor(styles.colors.dark)
               .text(value?.toString() || '', x + 5, y + 7, { 
                 width: scaledWidths[j] - 10, 
                 align: j === 0 ? 'center' : 'left' 
               });
            
            x += scaledWidths[j];
          });
          
          y += maxRowHeight;
          rowsDrawn++;
        }
        
        return { newY: y, rowsDrawn }; // Return the Y position after the table and number of rows drawn
      };

      // Function to add modern header to pages
      const addHeader = (isFirstPage) => {
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        
        if (isFirstPage) {
          // Header container - no background as requested
          const headerHeight = 100;
          
          // Left side - Logo (smaller size as requested)
          const logoPath = path.join(__dirname, 'logo.png');

          if (fs.existsSync(logoPath)) {
            doc.image(logoPath, doc.page.margins.left + 15, doc.page.margins.top, { height: 40 });
          } else {
            // If logo doesn't exist, draw a placeholder
            doc.rect(doc.page.margins.left + 15, doc.page.margins.top, 120, 40)
               .fillAndStroke('#ffffff', styles.colors.primary);
            doc.fontSize(16).fillColor(styles.colors.primary).font(styles.fonts.title)
               .text('TRAK24', doc.page.margins.left + 50, doc.page.margins.top + 12);
          }
          
          // Right side - Company address with increased size as requested
          doc.fontSize(11).font(styles.fonts.subtitle).fillColor(styles.colors.dark)
             .text('1, 44/1535-3, KOLATHPARAMBIL ANNEX', 
                   doc.page.width - doc.page.margins.right - 220, doc.page.margins.top, { align: 'right' })
             .text('Silver Lane, 44/1535', { align: 'right' })
             .text('3, Ashoka Rd, Kaloor,', { align: 'right' })
             .text('Ernakulam - 682017, Kerala', { align: 'right' });
          
          // Center aligned title (no background as requested)
          const titleY = doc.page.margins.top + 60;
          
          // Title text centered
          doc.fontSize(16).font(styles.fonts.title).fillColor(styles.colors.primary)
             .text(`Daily Trip Report for ${essentials.company} - ${essentials.make} ${essentials.model} (${essentials.regNo})`, 
                   doc.page.margins.left, titleY, 
                   { width: pageWidth, align: 'center' });
          
          // Date range directly below the title (no badge/background)
          doc.fontSize(12).font(styles.fonts.subtitle).fillColor(styles.colors.dark)
             .text(essentials.range, 
                   doc.page.margins.left, titleY + 25, 
                   { width: pageWidth, align: 'center' });
          
          return titleY + 50; // Y position after header
        } else {
          // Simplified header for subsequent pages
          const headerHeight = 40;
          
          // Logo (smaller)
          const logoPath = path.join(__dirname, 'logo.png');

          if (fs.existsSync(logoPath)) {
            doc.image(logoPath, doc.page.margins.left + 10, doc.page.margins.top - 5, { height: 25 });
          } else {
            // If logo doesn't exist, draw a placeholder
            doc.rect(doc.page.margins.left + 10, doc.page.margins.top - 5, 80, 25)
               .fill('#ffffff');
            doc.fontSize(12).fillColor(styles.colors.primary).font(styles.fonts.title)
               .text('TRAK24', doc.page.margins.left + 25, doc.page.margins.top + 3);
          }
          
          // Page title - Use correct page number
          doc.fontSize(10).font(styles.fonts.subtitle).fillColor(styles.colors.dark)
             .text(`${essentials.regNo} - Trip Report`, 
                  doc.page.width - doc.page.margins.right - 200, doc.page.margins.top + 5, 
                  { align: 'right' });
          
          return doc.page.margins.top + 30;
        }
      };

      // Function to add modern footer
      const addFooter = (pageNumber) => {
        const footerY = doc.page.height - doc.page.margins.bottom - 20;
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        
        // Footer bar with light color
        doc.rect(doc.page.margins.left, footerY, pageWidth, 20)
           .fill(styles.colors.lightBlue);
        
        // Dynamic footer text
        const footerText = `Report generated on ${essentials.genDate} by ${essentials.firstname}`;
        doc.fontSize(8).fillColor(styles.colors.primary).font(styles.fonts.body)
           .text(footerText, doc.page.margins.left + 10, footerY + 6);
        
        // Page number on right
        doc.fontSize(8).fillColor(styles.colors.dark)
           .text(`Page ${pageNumber}`, doc.page.width - doc.page.margins.right - 50, footerY + 6, 
                 { align: 'right' });
        
        // Website link
        doc.fontSize(8).fillColor(styles.colors.accent).font(styles.fonts.body)
           .text('Trak24.com Report Center', doc.page.margins.left + pageWidth / 2 - 50, footerY + 6);
      };

      // Calculate how many rows will fit on a single page
      const calculateRowsPerPage = (startY, isFirstPage) => {
        const pageHeight = doc.page.height;
        const footerSpace = 40; // Space for footer
        const availableHeight = pageHeight - startY - doc.page.margins.bottom - footerSpace;
        
        // Estimate average row height - be conservative to avoid overflowing
        const avgRowHeight = 35; // Average row height based on your data
        const headerHeight = 30; // Height of table header
        
        // Calculate max rows that will fit
        const maxRows = Math.floor((availableHeight - headerHeight) / avgRowHeight);
        return Math.max(1, maxRows); // Ensure at least 1 row per page
      };
      
      // Generate report with improved pagination
      let pageNum = 1;
      let processedRows = 0;
      let lastTableBottom = 0; // Track the bottom position of the last table drawn
      
      // First page
      let yPos = addHeader(true);
      let rowsPerPage = calculateRowsPerPage(yPos, true);
      
      // Draw first page table if there's data
      if (reports.length > 0) {
        const result = drawTable(reports.slice(0, rowsPerPage), yPos, rowsPerPage);
        lastTableBottom = result.newY; // Update the bottom position
        addFooter(pageNum);
        processedRows += result.rowsDrawn;
      }

      // Generate subsequent pages if needed
      while (processedRows < reports.length) {
        // Add a new page
        doc.addPage();
        pageNum++;
        
        // Add header to the new page
        yPos = addHeader(false);
        
        // Calculate max rows for this page
        rowsPerPage = calculateRowsPerPage(yPos, false);
        
        // Draw table with remaining data, up to rowsPerPage
        const result = drawTable(reports.slice(processedRows, processedRows + rowsPerPage), yPos, rowsPerPage);
        lastTableBottom = result.newY; // Update the bottom position
        addFooter(pageNum);
        
        // If no rows were drawn on this page, we might have an issue with space calculation
        // Break to avoid infinite loop
        if (result.rowsDrawn === 0) {
          break;
        }
        
        processedRows += result.rowsDrawn;
      }

      // Add statistics section on the last page
      // Use lastTableBottom to position the stats section properly below the last table
      const statsY = lastTableBottom + 40; // Add 40px padding after the table
      
      // Check if there's enough space for the stats section
      if (statsY + 180 > doc.page.height - doc.page.margins.bottom - 40) {
        // Not enough space, add a new page for stats
        doc.addPage();
        pageNum++;
        addHeader(false);
        addFooter(pageNum);
        // Reset statsY to be after the header on the new page
        const newPageHeaderY = doc.page.margins.top + 30;
        const statsYOnNewPage = newPageHeaderY + 40; // Add some padding after header
        
        // Add stats section on the new page
        addStatsSectionToPage(doc, statsYOnNewPage, reports, styles);
      } else {
        // Enough space, add stats on the current page
        addStatsSectionToPage(doc, statsY, reports, styles);
      }

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Helper function to add stats section to any page
function addStatsSectionToPage(doc, statsY, reports, styles) {
  const statsWidth = 300;
  const statsX = doc.page.margins.left + (doc.page.width - doc.page.margins.left - doc.page.margins.right - statsWidth) / 2;
  
  // Title with bottom border
  doc.fontSize(16).font(styles.fonts.title).fillColor(styles.colors.primary)
     .text('TRIP SUMMARY', statsX, statsY, { width: statsWidth, align: 'center' });
  
  // Add thin line separator
  doc.moveTo(statsX + 20, statsY + 30)
     .lineTo(statsX + statsWidth - 20, statsY + 30)
     .stroke(styles.colors.primary);
  
  // Calculate summary statistics
  const totalDistance = reports.reduce((sum, record) => sum + parseFloat(record.distance || 0), 0);
  const totalDuration = reports.reduce((sum, record) => {
    const durationParts = record.duration.match(/(\d+)h\s*(\d+)m/);
    if (durationParts) {
      return sum + (parseInt(durationParts[1]) * 60) + parseInt(durationParts[2]);
    }
    return sum;
  }, 0);
  
  // Format total duration
  const durationHours = Math.floor(totalDuration / 60);
  const durationMinutes = totalDuration % 60;
  const formattedDuration = `${durationHours}h ${durationMinutes}m`;
  
  // Stats with more spacing and cleaner layout
  const statY1 = statsY + 50;
  const statY2 = statY1 + 25;
  const statY3 = statY2 + 25;
  
  // Labels (left aligned)
  doc.fontSize(12).font(styles.fonts.body).fillColor(styles.colors.dark)
     .text('Total Trips:', statsX, statY1)
     .text('Total Distance:', statsX, statY2)
     .text('Total Duration:', statsX, statY3);
  
  // Values (right aligned)
  doc.fontSize(12).font(styles.fonts.title).fillColor(styles.colors.primary)
     .text(`${reports.length}`, statsX + 140, statY1, { width: statsWidth - 140, align: 'right' })
     .text(`${totalDistance.toFixed(1)} km`, statsX + 140, statY2, { width: statsWidth - 140, align: 'right' })
     .text(`${formattedDuration}`, statsX + 140, statY3, { width: statsWidth - 140, align: 'right' });
}