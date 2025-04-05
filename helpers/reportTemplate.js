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
        doc.fontSize(fontSize).font(fontFamily);
        return doc.heightOfString(text, { width });
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
        
        // Draw data rows with dynamic heights
        const start = 0;
        const end = Math.min(start + rowLimit, data.length);
        
        for (let i = start; i < end; i++) {
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
        }
        
        return y; // Return the Y position after the table
      };

      // Function to add modern header to pages
      const addHeader = (isFirstPage) => {
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        
        if (isFirstPage) {
          // Header container - no background as requested
          const headerHeight = 100;
          
          // Left side - Logo (smaller size as requested)
          const logoPath = path.join(__dirname, 'logo.png');
          if (fs.existsSync("./logo.png")) {
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
          
          // Page title
          doc.fontSize(10).font(styles.fonts.subtitle).fillColor(styles.colors.dark)
             .text(`${essentials.regNo} - Trip Report (Page ${doc.bufferedPageRange().count})`, 
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

      // Calculate dynamic row limits based on available space and content
      const getRowLimitForPage = (contentStart, isFirstPage) => {
        const pageHeight = doc.page.height;
        const footerSpace = 40; // Space reserved for footer
        const availableHeight = pageHeight - contentStart - doc.page.margins.bottom - footerSpace;
        const avgRowHeight = 40; // Average estimated row height
        
        // Return a conservative estimate
        const limit = Math.floor(availableHeight / avgRowHeight);
        return Math.max(1, limit); // Ensure at least one row per page
      };
      
      // Generate report with dynamic row limits
      let pageNum = 1;
      let processedRows = 0;
      
      // First page
      let yPos = addHeader(true);
      let firstPageRowLimit = getRowLimitForPage(yPos, true);
      let currentPageData = reports.slice(0, firstPageRowLimit);
      
      if (currentPageData.length > 0) {
        yPos = drawTable(currentPageData, yPos, currentPageData.length);
        addFooter(pageNum);
        processedRows += currentPageData.length;
      }

      // Generate subsequent pages if needed
      while (processedRows < reports.length) {
        // Add a new page
        doc.addPage();
        pageNum++;
        
        // Add header to the new page
        yPos = addHeader(false);
        
        // Calculate dynamic row limit for this page
        let pageRowLimit = getRowLimitForPage(yPos, false);
        
        // Calculate slice indices for this page
        const remainingRows = reports.length - processedRows;
        const rowsForThisPage = Math.min(pageRowLimit, remainingRows);
        currentPageData = reports.slice(processedRows, processedRows + rowsForThisPage);
        
        // Draw table with the subset of data
        if (currentPageData.length > 0) {
          yPos = drawTable(currentPageData, yPos, currentPageData.length);
          addFooter(pageNum);
          processedRows += currentPageData.length;
        }
      }

      // Add statistics section on the last page if space permits
      if (yPos + 150 < doc.page.height - doc.page.margins.bottom - 40) {
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
        
        // Modern stats layout with no background
        const statsY = yPos + 40;
        const statsWidth = 300;
        const statsX = doc.page.margins.left + (doc.page.width - doc.page.margins.left - doc.page.margins.right - statsWidth) / 2;
        
        // Title with bottom border
        doc.fontSize(16).font(styles.fonts.title).fillColor(styles.colors.primary)
           .text('TRIP SUMMARY', statsX, statsY, { width: statsWidth, align: 'center' });
        
        // Add thin line separator
        doc.moveTo(statsX + 20, statsY + 30)
           .lineTo(statsX + statsWidth - 20, statsY + 30)
           .stroke(styles.colors.primary);
        
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

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Sample data for testing
export const sampleEssentials = {
  company: "ABC Transport",
  make: "Toyota",
  model: "Corolla",
  regNo: "KL-01-AB-1234",
  range: " Feb 02, 2025, 05:30 AM to Apr 02, 2025, 05:30 AM",
  genDate: "Apr 02, 2025, 12:25 AM",
  firstname: "John Doe"
};

export const sampleReports = [
  {
    slNo: 1,
    startTD: "01-04-2025 08:30 AM",
    stopTD: "01-04-2025 10:15 AM",
    duration: "1h 45m",
    startLocation: "Ernakulam City CenterErnakulam City CenterErnakulam City CenterErnakulam City Center",
    stopLocation: "Aluva Bus TerminalAluva Bus Terminal",
    startKm: "12540",
    stopKm: "12565",
    distance: "25",
    speedInfo: "Avg: 45 km/h"
  },
  {
    slNo: 2,
    startTD: "01-04-2025 11:30 AM",
    stopTD: "01-04-2025 01:00 PM",
    duration: "1h 30m",
    startLocation: "Aluva Bus Terminal",
    stopLocation: "Edappally JunctionAluva Bus Terminal",
    startKm: "12565",
    stopKm: "12585",
    distance: "20",
    speedInfo: "Avg: 40 km/h"
  },
  {
    slNo: 3,
    startTD: "01-04-2025 02:15 PM",
    stopTD: "01-04-2025 04:00 PM",
    duration: "1h 45m",
    startLocation: "Edappally JunctionAluva Bus Terminal",
    stopLocation: "Kakkanad IT Park",
    startKm: "12585",
    stopKm: "12600",
    distance: "15",
    speedInfo: "Avg: 35 km/h"
  },
  {
    slNo: 4,
    startTD: "01-04-2025 05:00 PM",
    stopTD: "01-04-2025 06:30 PM",
    duration: "1h 30m",
    startLocation: "Kakkanad IT Park",
    stopLocation: "Ernakulam City Center",
    startKm: "12600",
    stopKm: "12625",
    distance: "25",
    speedInfo: "Avg: 42 km/h"
  },
  {
    slNo: 5,
    startTD: "02-04-2025 08:00 AM",
    stopTD: "02-04-2025 09:30 AM",
    duration: "1h 30m",
    startLocation: "Ernakulam City Center",
    stopLocation: "Fort Kochi",
    startKm: "12625",
    stopKm: "12640",
    distance: "15",
    speedInfo: "Avg: 38 km/h"
  },
  {
    slNo: 6,
    startTD: "02-04-2025 10:30 AM",
    stopTD: "02-04-2025 12:00 PM",
    duration: "1h 30m",
    startLocation: "Fort Kochi",
    stopLocation: "Vypin Island",
    startKm: "12640",
    stopKm: "12655",
    distance: "15",
    speedInfo: "Avg: 30 km/h"
  },
  {
    slNo: 7,
    startTD: "02-04-2025 01:30 PM",
    stopTD: "02-04-2025 03:00 PM",
    duration: "1h 30m",
    startLocation: "Vypin Island",
    stopLocation: "Ernakulam City Center",
    startKm: "12655",
    stopKm: "12680",
    distance: "25",
    speedInfo: "Avg: 40 km/h"
  },
  {
    slNo: 8,
    startTD: "03-04-2025 09:00 AM",
    stopTD: "03-04-2025 11:30 AM",
    duration: "2h 30m",
    startLocation: "Ernakulam City Center",
    stopLocation: "Kottayam Town",
    startKm: "12680",
    stopKm: "12735",
    distance: "55",
    speedInfo: "Avg: 48 km/h"
  },
  {
    slNo: 9,
    startTD: "03-04-2025 01:00 PM",
    stopTD: "03-04-2025 03:30 PM",
    duration: "2h 30m",
    startLocation: "Kottayam Town",
    stopLocation: "Ernakulam City Center",
    startKm: "12735",
    stopKm: "12790",
    distance: "55",
    speedInfo: "Avg: 46 km/h"
  },
  {
    slNo: 10,
    startTD: "04-04-2025 08:30 AM",
    stopTD: "04-04-2025 09:45 AM",
    duration: "1h 15m",
    startLocation: "Ernakulam City Center",
    stopLocation: "Angamaly Junction",
    startKm: "12790",
    stopKm: "12820",
    distance: "30",
    speedInfo: "Avg: 44 km/h"
  },
  {
    slNo: 11,
    startTD: "04-04-2025 11:00 AM",
    stopTD: "04-04-2025 12:30 PM",
    duration: "1h 30m",
    startLocation: "Angamaly Junction",
    stopLocation: "Ernakulam City Center",
    startKm: "12820",
    stopKm: "12850",
    distance: "30",
    speedInfo: "Avg: 45 km/h"
  }
];