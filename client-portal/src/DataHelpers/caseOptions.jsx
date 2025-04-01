export const caseDescOptions = {
    Accounts: [
        { value: 1, label: "Billing Updates" },
        { value: 2, label: "Cheque Collection" },
        { value: 2, label: "Cheque Deposit" },
        { value: 3, label: "Credit Limit Exceeded" },
    ],
    Device: [
        { value: 4, label: "Electrician Visit" },
        { value: 5, label: "Engine Issues" },
        { value: 6, label: "Faulty Backup Battery" },
        { value: 7, label: "Faulty Device" },
        { value: 8, label: "Fuel Level Display" },
        { value: 9, label: "GPS Antenna Error" },
        { value: 10, label: "Input Issues- A/C" },
        { value: 11, label: "Input Issues - Ignition" },
        { value: 12, label: "Installation Fault" },
        { value: 13, label: "KM Reading Issue" },
        { value: 14, label: "Out of Coverage" },
        { value: 15, label: "Power Lost" },
        { value: 16, label: "Removal Request" },
        { value: 17, label: "Replacement Request" },
        { value: 18, label: "VSS" },
    ],
    GIS: [
        { value: 19, label: "Missing Location" },
        { value: 20, label: "Wrong Location" },
    ],
    IT: [
        { value: 21, label: "Browser Issues" },
        { value: 22, label: "GeoFence Issues" },
        { value: 23, label: "GIS Updates" },
        { value: 24, label: "System Errors" },
    ],
    Sales: [
        { value: 25, label: "New Sale" },
    ],
    Support: [
        { value: 26, label: "Country Border Post" },
        { value: 27, label: "Customer Complaint" },
        { value: 28, label: "Customer Complaint-SMS" },
        { value: 29, label: "Customization Request" },
        { value: 30, label: "Feedback Call" },
        { value: 31, label: "Garage Event" },
        { value: 32, label: "Ignition Attempt Event" },
        { value: 33, label: "New Contact" },
        { value: 34, label: "No Movement Event" },
        { value: 35, label: "Police Confiscation Areas" },
        { value: 36, label: "Problem Noticed" },
        { value: 37, label: "SMS Not Delivered" },
        { value: 38, label: "State Border Post" },
        { value: 39, label: "TOW Event" },
    ],
};


const getCaseDescLabel = (caseType, caseDescValue) => {
    const options = caseDescOptions[caseType] || [];
    const foundOption = options.find((option) => option.value === caseDescValue);
    return foundOption ? foundOption.label : "Unknown";
};

export const TableRow = ({ item }) => {
    const caseDescLabel = getCaseDescLabel(item.caseType, parseInt(item.caseDesc));
    return (
            <td className="px-6 py-6 text-sm text-gray-900 dark:text-gray-300 text-center">
                {item.caseType} - {caseDescLabel}
            </td>
    );
};


const alertMessages = {
    "BSTPL$1": "NIL",
    "BSTPL$3": "MAIN BATTERY DISCONNECTED",
    "BSTPL$4": "INTERNAL BATTERY LOW",
    "BSTPL$5": "HARSH ACCELERATION",
    "BSTPL$6": "HARSH BREAKING",
    "BSTPL$7": "OVER SPEEDING",
    "BSTPL$9": "SOS",
  };
  
  export default function AlertRow({ item }) {
    const message = alertMessages[item] || "Unknown Alert"; // Default message if not found
  
    return (
      <td className={`px-6 py-4 text-sm ${message==="NIL"?"text-gray-900 dark:text-gray-300":"text-red-500 dark:text-red-500 font-bold"} text-center`}>
        {message}
      </td>
    );
  }