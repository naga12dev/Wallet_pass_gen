// server.js
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

app.post('/generatePass', (req, res) => {
  const { userName, coPay } = req.body;

  const passData = {
    format: 'PKBarcodeFormatPDF417',
    message: 'Pass for ' + userName,
    headerFields: [
      { key: 'user', label: 'Name', value: userName },
      { key: 'coPay', label: 'Co-pay', value: coPay },
    ],
  };

  const passPath = __dirname + '/public/Test.pkpass';
  // createPass(passData, passPath);

const filePath = '/Users/hnerella@amgen.com/Downloads/pkpass-generator/walletPass_gen/public/Test.pass/pass.json';

updateOrganizationName(filePath, userName.toString(), coPay);

  tffff();
  res.json({ passUrl: '/Test.pkpass' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

  
function createPass(passData, passPath) {
  const manifest = {};
  const files = [];

  // Add pass.json to manifest
  const passJson = JSON.stringify(passData, null, 2);
  manifest['pass.json'] = hashContent(passJson);
  files.push({ path: 'pass.json', content: passJson });

  // Add icon.png (replace with your own icon)
  const iconPath = __dirname + '/public/icon.png';
  const iconContent = fs.readFileSync(iconPath);
  manifest['icon.png'] = hashContent(iconContent);
  files.push({ path: 'icon.png', content: iconContent });

  // Create signature
  const signature = createSignature(manifest, files);

  // Write files
  fs.writeFileSync(passPath, JSON.stringify({ manifest, files, signature }));
}

function hashContent(content) {
  return crypto.createHash('sha1').update(content).digest('hex');
}


// const fs = require('fs');
// const crypto = require('crypto');

function createSignature(manifest, files) {
  const privateKeyPath = '/Users/hnerella@amgen.com/Downloads/pkpass-generator/walletPass_gen/test.pem'; // Replace with your private key path
  console.log('Private Key Path:', privateKeyPath);

  try {
    const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
    console.log('Private Key:', privateKey);

    const manifestContent = JSON.stringify(manifest, null, 2);
    const filesContent = files.map(file => file.content).join('');
    const combinedContent = manifestContent + filesContent;

    const sign = crypto.createSign('RSA-SHA256');
    sign.write(combinedContent, 'utf8');
    sign.end();

    const signature = sign.sign(privateKey, 'base64');
    console.log('Signature:', signature);

    return signature;
  } catch (error) {
    console.error('Error reading private key:', error.message);
    throw error; // Re-throw the error to indicate failure
  }
}

// // Usage example:
// const manifest = { /* your manifest data */ };
// const files = [/* your file objects with content */];
// createSignature(manifest, files);

//////////////////
function tffff() {
  const { exec } = require('child_process');

  // Replace 'yourExecutable.exe' with the actual path to your executable
  const executablePath = '/Users/hnerella@amgen.com/Downloads/pkpass-generator/walletPass_gen/signpass';
  
  // Replace 'yourArguments' with any command-line arguments your executable requires
  const arguments = '-p /Users/hnerella@amgen.com/Downloads/pkpass-generator/walletPass_gen/public/Test.pass';
  
  // Execute the command
  exec(`${executablePath} ${arguments}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
  
}

// const fs = require('fs');

function updateOrganizationName(filePath, newOrganizationName, newLabel) {
  // Read the JSON file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    try {
      // Parse the JSON data
      const json = JSON.parse(data);

      // Update organizationName
      json.logoText = newOrganizationName;

      if (json.storeCard && json.storeCard.primaryFields && json.storeCard.primaryFields.length > 0) {
        json.storeCard.primaryFields[0].label = newLabel;
      } else {
        console.error('Error: Store card or primaryFields not found in the JSON.');
        callback(new Error('Invalid JSON structure'));
        return;
      }

      // Convert the updated JSON back to a string
      const updatedJsonString = JSON.stringify(json, null, 2);

      // Write the updated JSON back to the file
      fs.writeFile(filePath, updatedJsonString, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to the file:', err);
          return;
        }

        console.log('OrganizationName updated successfully!');
      });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
    }
  });
}


