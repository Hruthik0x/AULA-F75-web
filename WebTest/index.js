const delay = ms => new Promise(res => setTimeout(res, ms));

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function convertString2Array(str) {
    // Remove whitespace and outer brackets
    str = str.trim();

    // Match each inner [...] group
    let rows = str.match(/\[([^\]]+)\]/g);

    return rows.map(row => {
        // Remove brackets, split by comma
        return row
            .replace(/[\[\]]/g, "")
            .split(",")
            .map(x => parseInt(x.trim(), 16));  // convert to number (hex)
    });
}


function add_def_vals(arr) {
    const def_data = [0x13, 0x01, 0x25];

    return arr.map((row, i) => {
        let newRow = [...def_data, ...row];
        const checksum = newRow.reduce((a, b) => a + b, 0) % 0xFF;
        newRow.push(checksum);
        return newRow;
    });
}

async function getDevice() {
    // 2.4
    // const devices = await navigator.hid.requestDevice({ filters: [{ vendorId: 0x3554, productId: 0xFA09 }] });
    // VID 0x258a
    // PID 0x010c

    // wired 
    const devices = await navigator.hid.requestDevice({ filters: [{ vendorId: 0x258a, productId: 0x010c }] });

    // TODO : Dynamically select the correct ID
    const device = devices[0];
    await device.open();
    return device;
}

async function sendMultiMedia_HID() {
  try {
    const device = await getDevice();

    // Put only data to be sent
    let dataArray = `[
  [00, 0e, 02, 00, 00, e9, 00, 00, 00, 35, 00, 00, 00, 2b, 00, 00],
  [24, 08, 00, 00, 00, 00, 00, 00, 5a, a5, 00, 00, 00, 00, 00, 00]
]`;

// //     let dataArray = `[
// //   [00, 0e, 00, 00, 00, 29, 00, 00, 00, 35, 00, 00, 00, 2b, 00, 00],
// //   [24, 08, 00, 00, 00, 00, 00, 00, 5a, a5, 00, 00, 00, 00, 00, 00]
// // ]`;

    dataArray = convertString2Array(dataArray)
    dataArray = add_def_vals(dataArray)

    // dataArray = [];

    let acks = 0;
    let firstTrySuccess = 0;
    let cur_acks = 0;

    device.oninputreport = (event) => {
        // assert (dataArray[cur_acks].length === event.data.byteLength, `${dataArray[cur_acks].length} ${event.data.byteLength}`);
        const input_data = []
        for (let i = 0; i < event.data.byteLength; i++) {
            input_data.push(event.data.getUint8(i));
            // assert (dataArray[cur_acks][i] === event.data.getUint8(i), `${i}\n${dataArray[cur_acks][i]}\n${event.data.getUint8(i)}`);
        }
        console.log(dataArray[cur_acks])
        console.log(input_data)
        acks += 1;
    };

    async function waitForAck(recheckTime) {
        return new Promise(resolve => {
            if (acks > cur_acks) {
                firstTrySuccess += 1;
                cur_acks += 1
                resolve();
                return;
            }

            const interval = setInterval(() => {
                if (acks > cur_acks) {
                    clearInterval(interval);
                    cur_acks += 1;
                    resolve();
                }
            }, recheckTime); 
        });
    }

    // Sending reports
    for (const obj of dataArray) {
        console.log(obj.length);
        const reportId = obj[0];
        const reportData = new Uint8Array(obj.slice(1));

        await device.sendReport(reportId, reportData);
        await delay(10);
        await waitForAck(5);
    }

    console.log(firstTrySuccess, cur_acks);

    } catch (error) {
        console.error('Error during HID communication:', error);
    }
}

async function sendPackets_HID() {
  try {
    const device = await getDevice();

    // put the data here to test it.
    const dataArray = [];

    let acks = 0;
    let firstTrySuccess = 0;
    let cur_acks = 0;

    device.oninputreport = (event) => {
        acks += 1;
        const bytes = [];
        for (let i = 0; i < event.data.byteLength; i++) {
            bytes.push(event.data.getUint8(i));
        }

        console.log(`Report ID: ${event.reportId}, Data:`, bytes);
    };

    async function waitForAck(recheckTime) {
        return new Promise(resolve => {
            if (acks > cur_acks) {
                firstTrySuccess += 1;
                cur_acks += 1
                resolve();
                return;
            }

            const interval = setInterval(() => {
                if (acks > cur_acks) {
                    clearInterval(interval);
                    cur_acks += 1;
                    resolve();
                }
            }, recheckTime); 
        });
    }

    // Sending reports
    for (const obj of dataArray) {
        const dir = obj[0];
        const reportId = obj[1];
        const reportData = new Uint8Array(obj.slice(2));

        if (dir === 0) {
            await device.sendReport(reportId, reportData);
        } else {
            // wait for the reply (could be configured to speed up stuff at the expense of processing power)
            await delay(10);
            await waitForAck(5);
        }
    }

    console.log(firstTrySuccess, cur_acks);

    } catch (error) {
        console.error('Error during HID communication:', error);
    }
}

// No point, keyboard doesn't support feature report 
async function getReport() {
    const device = await getDevice();
    let reportId = 0x13; // depends on device
    let featureReport = await device.receiveFeatureReport(reportId);
    console.log("Feature report:", new Uint8Array(featureReport.buffer));
}

document.getElementById('connect').addEventListener('click', sendMultiMedia_HID);