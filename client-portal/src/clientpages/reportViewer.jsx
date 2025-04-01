import React, { lazy, Suspense,useEffect,useState } from "react";
import ReactDOM from 'react-dom';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
import LoadingOverlay from '../Components/Loader';
import { processReportData } from '../DataHelpers/ReportPro';

const RTemplate = lazy(() => import("../Components/ReportTemplate"));
function ReportViewer() {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState([]);
    const [isFetching, setIsFetching] = useState(false); // Track fetching state
    const [isProcessing, setIsProcessing] = useState(false);
    const [loading, setloading] = useState(false)
    const arr = searchParams.get("array");

    const array = arr ? JSON.parse(decodeURIComponent(arr)) : [];

    useEffect(() => {
        GetReports();
    }, []);

    const GetReports = async () => {
        try {
            setloading(true)
            setIsFetching(true); // Start fetching
            const url = `/api-trkclt/reports/by-date?startDate=${array.start}&endDate=${array.end}&imei=${array.imei}`;
            const response = await axios.get(url);

            setIsFetching(false); // Fetching complete
            setIsProcessing(true);
            const d = await processReportData(response.data.reports[0].reports);
            setData(d);
            setIsProcessing(false); // Processing complete
            setloading(false)
        } catch (error) {
            console.error(error);
            setIsFetching(false);
            setIsProcessing(false);
            setloading(false)
        }
    };
    return (
        <>
        {isFetching ? (
            <LoadingOverlay report={true} isLoading={loading} message={"Fetching Reports..."}/>
        ) : isProcessing ? (
            <LoadingOverlay report={true} isLoading={loading} message={"Processing Reports..."}/>
        ) : data.length > 0 ? (
            <>
                {/* PDF Download Button */}
                <PDFDownloadLink 
                    document={<RTemplate reports={data} essentials={array} />} 
                    fileName="report.pdf"
                >
                    {({ loading }) => loading ? "Generating PDF..." : "Download PDF"}
                </PDFDownloadLink>
            </>
        ) : (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h1>No Reports Available</h1>
                </div>
            </div>
        )}
    </>
    );
}

export default ReportViewer;
