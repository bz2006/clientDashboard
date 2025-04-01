import React, { lazy, useEffect, useState } from "react";
import { pdf } from '@react-pdf/renderer';
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
import LoadingOverlay from '../Components/Loader';
import { processReportData } from '../DataHelpers/ReportPro';

const RTemplate = lazy(() => import("../Components/ReportTemplate"));

function ReportViewer() {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [loading, setLoading] = useState(false);
    const arr = searchParams.get("array");

    const array = arr ? JSON.parse(decodeURIComponent(arr)) : [];

    useEffect(() => {
        GetReports();
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            generateAndDownloadPDF();
        }
    }, [data]); // Trigger download when data is ready

    const GetReports = async () => {
        try {
            setLoading(true);
            setIsFetching(true);
            const url = `/api-trkclt/reports/by-date?startDate=${array.start}&endDate=${array.end}&imei=${array.imei}`;
            const response = await axios.get(url);

            setIsFetching(false);
            setIsProcessing(true);
            const d = await processReportData(response.data.reports[0].reports);
            setData(d);
            setIsProcessing(false);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setIsFetching(false);
            setIsProcessing(false);
            setLoading(false);
        }
    };

    const generateAndDownloadPDF = async () => {
        try {
            const blob = await pdf(<RTemplate reports={data} essentials={array} />).toBlob();
            const url = URL.createObjectURL(blob);
            const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '');
            const fileName = `trak24-report_${array.imei}_${timestamp}.pdf`;
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setTimeout(() => {
                window.close(); // Close the page after download
            }, 2000); // Allow some time for download before closing
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    return (
        <>
            {isFetching ? (
                <LoadingOverlay report={true} isLoading={loading} message={"Fetching Reports..."} />
            ) : isProcessing ? (
                <LoadingOverlay report={true} isLoading={loading} message={"Processing Reports..."} />
            ) : data.length > 0 ? (
                <div className="flex justify-center items-center h-screen">
                    <h1>Report Generated and Downloaded</h1>
                </div>
            ) : (
                <div className="flex justify-center items-center h-screen">
                    <h1>No Reports Available</h1>
                </div>
            )}
        </>
    );
}

export default ReportViewer;
