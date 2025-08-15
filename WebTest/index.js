const delay = ms => new Promise(res => setTimeout(res, ms));

async function sendPackets_HID() {
  try {
    const devices = await navigator.hid.requestDevice({ filters: [{ vendorId: 0x3554, productId: 0xFA09 }] });

    // TODO : Dynamically select the correct ID
    const device = devices[0];
    await device.open();

    // put the data here to test it.
    const dataArray = [];

    let acks = 0;
    let firstTrySuccess = 0;
    let cur_acks = 0;

    device.oninputreport = (event) => {
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

document.getElementById('connect').addEventListener('click', sendPackets_HID);