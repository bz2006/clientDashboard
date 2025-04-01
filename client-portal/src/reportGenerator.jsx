import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
import { processReportData } from './DataHelpers/ReportPro';
import RTemplate from './Components/ReportTemplate';

function ReportGenerator() {
    const [searchParams] = useSearchParams();
    const d = JSON.parse(searchParams.get("data"))
    const [data, setData] = useState([]);
    const [isFetching, setIsFetching] = useState(false); // Track fetching state
    const [isProcessing, setIsProcessing] = useState(false);


    const CheckExpiry = (ts) => {
        const currentTime = new Date();
        const timestamp = new Date(ts);
        const timeDifference = currentTime - timestamp;

        const oneHourInMilliseconds = 15 * 60 * 1000; // 1 hour in milliseconds
        const isLessThanOneHour = timeDifference <= oneHourInMilliseconds;
        return isLessThanOneHour
    }

    useEffect(() => {
        const expirey = CheckExpiry(d.ts)
        if (!expirey) {
            alert("Link Expired")
        }else{
            GetReports(d.start, d.end,d.imei);
        }
    }, [])



    // {
    //     "imei":"4342325",
    //     "start":"2025-01-30",
    //     "end":"2025-01-30"
    // }
    const triggerDownload = () => {
        const expirey = CheckExpiry(d.ts)
        if (data.length > 0&&expirey===true) {
            const essentials={
                company:d.company,
                make:d.make,
                firstname:d.firstname,
                genDate:d.genDate,
                range: d.range,
                regNo:d.regNo
            }
            
            const pdfBlob = pdf(<RTemplate reports={data} essentials={essentials} />).toBlob();
            pdfBlob.then(blob => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "report.pdf"; 
                link.click();
                window.close();
            });
        }
    };

    useEffect(() => {
        if (!isFetching && !isProcessing && data.length > 0) {
            triggerDownload(); // Trigger PDF download once data is ready

        }
    }, [data, isFetching, isProcessing]);

    const GetReports = async (start,end,imei) => {
        try {
            
            setIsFetching(true); // Start fetching
            const url = `/api-trkclt/reports/by-date?startDate=${start}&endDate=${end}&imei=${imei}`
            const response = await axios.get(url);

            setIsFetching(false); // Fetching complete
            setIsProcessing(true); 

            const d = await processReportData(response.data.reports[0].reports);
            setData(d);
            setIsProcessing(false); // Processing complete
        } catch (error) {
            console.error(error);
            setIsFetching(false);
            setIsProcessing(false);
        }
    };


    return (
        <></>
    );
}

export default ReportGenerator;
