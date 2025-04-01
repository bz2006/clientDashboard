import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';



// Rows per page
const firstPageRowLimit = 5; // Adjust based on available space on the first page
const subsequentPageRowLimit = 6; // Adjust for other pages

// Create Document Component
const RTemplate = ({reports,essentials}) => (
    <Document>
        {/* First Page */}
        <Page size="A4" style={styles.page} orientation="landscape">
            {/* Header Section */}
            <View style={styles.firstPageHeader}>
                <View style={styles.headerLeft}>
                    <Image src={window.location.origin + "/assets/trak24comtr.png"} style={styles.logoLarge} />
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.companyAddress}>1, 44/1535-3, KOLATHPARAMBIL ANNEX</Text>
                    <Text style={styles.companyAddress}>Silver Lane, 44/1535</Text>
                    <Text style={styles.companyAddress}>3, Ashoka Rd, Kaloor,</Text>
                    <Text style={styles.companyAddress}>Ernakulam - 682017, Kerala</Text>
                </View>
            </View>

            {/* Separator Line */}
            <View style={styles.separatorLine} />

            <View style={styles.bottomHeading}>
                <Text style={styles.bottomText}>Daily Trip Report for {essentials.company} - {essentials.make} {essentials.model} ({essentials.regNo})</Text>
                <Text style={styles.bottomText2}>{essentials.range}</Text>
            </View>

            {/* Table Section */}
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.tableHeader, { maxWidth: 40 }]}>Sl No</Text>
                    <Text style={[styles.tableCell, styles.tableHeader, { maxWidth: 100 }]}>Start Time & Date</Text>
                    <Text style={[styles.tableCell, styles.tableHeader, { maxWidth: 100 }]}>Stop Time & Date</Text>
                    <Text style={[styles.tableCell, styles.tableHeader, { minWidth: 10 }]}>Duration</Text>
                    <Text style={[styles.tableCell, styles.tableHeader, { minWidth: 150 }]}>Start Location</Text>
                    <Text style={[styles.tableCell, styles.tableHeader, { minWidth: 150 }]}>Stop Location</Text>
                    <Text style={[styles.tableCell, styles.tableHeader, { maxWidth: 70 }]}>Start KM</Text>
                    <Text style={[styles.tableCell, styles.tableHeader, { maxWidth: 70 }]}>Stop KM</Text>
                    <Text style={[styles.tableCell, styles.tableHeader, { maxWidth: 70 }]}>Distance</Text>
                    <Text style={[styles.tableCell, styles.tableHeader, { maxWidth: 100 }]}>Speed Info</Text>
                </View>

                {reports.slice(0, firstPageRowLimit).map((row, index) => (
                    <View style={styles.tableRow} key={index}>
                        <Text style={[styles.tableCell, { maxWidth: 40 }]}>{row.slNo}</Text>
                        <Text style={[styles.tableCell, { maxWidth: 100 }]}>{row.startTD}</Text>
                        <Text style={[styles.tableCell, { maxWidth: 100 }]}>{row.stopTD}</Text>
                        <Text style={[styles.tableCell, { minWidth: 10 }]}>{row.duration}</Text>
                        <Text style={[styles.tableCell, { minWidth: 150 }]}>{row.startLocation}</Text>
                        <Text style={[styles.tableCell, { minWidth: 150 }]}>{row.stopLocation}</Text>
                        <Text style={[styles.tableCell, { maxWidth: 70 }]}>{row.startKm}</Text>
                        <Text style={[styles.tableCell, { maxWidth: 70 }]}>{row.stopKm}</Text>
                        <Text style={[styles.tableCell, { maxWidth: 70 }]}>{row.distance} km</Text>
                        <Text style={[styles.tableCell, { maxWidth: 100 }]}>{row.speedInfo}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.bottomHeading2}>
                <Text style={styles.bottomText22}>Report generated on {essentials.genDate} by {essentials.firstname} - Trak24.com Report Center</Text>
            </View>

        </Page>


        {/* Subsequent Pages */}
        {Array.from(
            { length: Math.ceil((reports.length - firstPageRowLimit) / subsequentPageRowLimit) },
            (_, pageIndex) => (
                <Page size="A4" style={styles.page} orientation="landscape" key={pageIndex + 1}>
                    <View style={styles.firstPageHeader}>
                        <View style={styles.headerLeft}>
                            <Image src="/assets/trak24comtr.png" style={styles.logo2} />
                        </View>
                        <View style={styles.headerRight}>
                            <Text style={styles.dlR}>Daily Trip Report: {essentials.company}</Text>
                        </View>
                    </View>

                    {/* Separator Line */}
                    <View style={styles.separatorLine} />

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.tableHeader, { maxWidth: 40 }]}>Sl No</Text>
                            <Text style={[styles.tableCell, styles.tableHeader, { maxWidth: 100 }]}>Start Time & Date</Text>
                            <Text style={[styles.tableCell, styles.tableHeader, { maxWidth: 100 }]}>Stop Time & Date</Text>
                            <Text style={[styles.tableCell, styles.tableHeader, { minWidth: 10 }]}>Duration</Text>
                            <Text style={[styles.tableCell, styles.tableHeader, { minWidth: 150 }]}>Start Location</Text>
                            <Text style={[styles.tableCell, styles.tableHeader, { minWidth: 150 }]}>Stop Location</Text>
                            <Text style={[styles.tableCell, styles.tableHeader, { maxWidth: 70 }]}>Start KM</Text>
                            <Text style={[styles.tableCell, styles.tableHeader, { maxWidth: 70 }]}>Stop KM</Text>
                            <Text style={[styles.tableCell, styles.tableHeader, { maxWidth: 70 }]}>Distance</Text>
                            <Text style={[styles.tableCell, styles.tableHeader, { maxWidth: 100 }]}>Speed Info</Text>
                        </View>

                        {reports
                            .slice(
                                firstPageRowLimit + pageIndex * subsequentPageRowLimit,
                                firstPageRowLimit + (pageIndex + 1) * subsequentPageRowLimit
                            )
                            .map((row, index) => (
                                <View style={styles.tableRow} key={index}>
                                    <Text style={[styles.tableCell, { maxWidth: 40 }]}>{row.slNo}</Text>
                                    <Text style={[styles.tableCell, { maxWidth: 100 }]}>{row.startTD}</Text>
                                    <Text style={[styles.tableCell, { maxWidth: 100 }]}>{row.stopTD}</Text>
                                    <Text style={[styles.tableCell, { minWidth: 10 }]}>{row.duration}</Text>
                                    <Text style={[styles.tableCell, { minWidth: 150 }]}>{row.startLocation}</Text>
                                    <Text style={[styles.tableCell, { minWidth: 150 }]}>{row.stopLocation}</Text>
                                    <Text style={[styles.tableCell, { maxWidth: 70 }]}>{row.startKm}</Text>
                                    <Text style={[styles.tableCell, { maxWidth: 70 }]}>{row.stopKm}</Text>
                                    <Text style={[styles.tableCell, { maxWidth: 70 }]}>{row.distance} km</Text>
                                    <Text style={[styles.tableCell, { maxWidth: 100 }]}>{row.speedInfo}</Text>
                                </View>
                            ))}
                    </View>
                    <View style={styles.bottomHeading2}>
                    <Text style={styles.bottomText22}>Report generated on {essentials.genDate} by {essentials.firstname} - Trak24.com Report Center</Text>
                    </View>
                </Page>
            )
        )}
    </Document>
);

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 20,
    },
    firstPageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5, // Updated margin
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        flex: 1,
        textAlign: 'right',
        flexDirection: 'column',
    },
    logoLarge: {
        width: 200, // Merged the updated width
        height: 'auto',
    },
    companyAddress: {
        fontSize: 10,
        lineHeight: 1.4,
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#000',
        marginVertical: 10,
    },
    bottomHeading: {
        textAlign: 'center',
    },
    bottomHeading2: {
        textAlign: 'left',
    },
    bottomText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    bottomText2: {
        marginTop: 5,
        fontSize: 12,
        fontWeight: 'bold',
    },
    bottomText22: {
        marginTop: 5,
        fontSize: 10,
        color: "orange",
        fontWeight: 'bold',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    table: {
        display: 'table',
        width: 'auto',
        marginTop: 20,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        paddingVertical: 5,
    },
    tableCell: {
        flex: 1,
        fontSize: 10,
        padding: 5,
    },
    tableHeader: {
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0',
    },
    smallLogo: {
        width: 50,
        height: 20,
        marginBottom: 10,
    },
    section: {
        marginTop: 10,
    },

    PageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5, // Updated margin
    },
    logo2: {
        width: 100, // Merged the updated width
        height: 'auto',
    },
    dlR: {
        fontSize: 12,
    },

});


export default RTemplate;
