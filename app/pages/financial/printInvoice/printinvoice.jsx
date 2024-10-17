import jsPDF from "jspdf";
import "jspdf-autotable";

const printInvoice = (invoiceData) => {
  const {
    invoiceNumber,
    class: className,
    semester,
    invoiceItems,
    totalAmount,
    dateIssued,
  } = invoiceData;
   const doc = new jsPDF({
     format: "a5",
     orientation: "landscape",
     unit: "mm",
   });

  // Create a new jsPDF instance
//   const doc = new jsPDF();

  // Set font
  doc.setFont("helvetica");

  // Add logo
  const logoUrl = "/favicon.ico"; // Adjust this path if necessary
  const logoSize = 20; // Size of the logo in mm

  // Load the image
  const img = new Image();
  img.src = logoUrl;

  img.onload = function () {
    // Add the image to the PDF
    doc.addImage(img, "PNG", 10, 10, logoSize, logoSize);

    // Add header
    doc.setFontSize(22);
    doc.text("Invoice", 105, 25, { align: "center" });

    // Add invoice details
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoiceNumber}`, 20, 45);
    doc.text(`Date Issued: ${dateIssued}`, 20, 55);
    doc.text(`Class: ${className}`, 20, 65);
    doc.text(`Semester: ${semester}`, 20, 75);

    // Add invoice items table
    const tableColumn = ["Description", "Amount (GHC)"];
    const tableRows = invoiceItems.map((item) => [
      item.description,
      item.amount.toFixed(2),
    ]);

    doc.autoTable({
      startY: 85,
      head: [tableColumn],
      body: tableRows,
    });

    // Add total amount
    const finalY = doc.lastAutoTable.finalY || 85;
    doc.text(`Total Amount: GHC ${totalAmount.toFixed(2)}`, 20, finalY + 20);

    // Add footer
    doc.setFontSize(10);
    doc.text(
      "Please do your best to pay the fees on time. For any queries, please contact the school administration.",
      20,
      finalY + 40
    );

    // Open print dialog
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };

  img.onerror = function () {
    console.error("Error loading the logo image");
    // Proceed with PDF generation without the logo
    // (You can copy the PDF generation code here, excluding the logo part)
  };
};

export default printInvoice;
