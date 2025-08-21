### Terminology 
- First byte 0 : Output -> Sent by software to keyboard
- First byte 1 : Input  -> Sent by keybaord to software
- First byte is not part of packet.

### Init packets
Sent by the software when it detects the keyboard, stuff runs fine without implementing these anyway ... 

```
[0, 19, 7, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27], 
[1, 19, 7, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29], 
[0, 19, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25], 
[1, 19, 5, 1, 0, 10, 3, 0, 0, 0, 0, 205, 1, 0, 0, 0, 0, 0, 0, 0, 244], 
[1, 19, 10, 1, 0, 4, 5, 75, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 115],
```

## Observations 
- Non acknowledge packets : 
    - Software to keyboard (USB_CONTROL out)
        - Length : 56
        - Src == 2.20.2
        - data present at data_layer.usb_capdata
    - Keyboard to software (USB_INTERRUPT in)
        - Length : 47
        - Dst == 2.20.0
        - data present at data_layer.usb_data_fragment
- Issues : 
    - Keyboard does not report back the current configs
    - Sets the entire stuff to default, cuz it does not know the existing configs 
    - Sends packets for configuring every key, even if you want to configure only one key

    
## Multimedia shortcuts 
- After every packet sent, wait for acknowledgement (acknowledgement data is same as the data sent)
- Total sent 37, received 37
- packet [0] = 19   (ID)
- packet [1] = 1    (Idk, is it like "1" for multimedia ?)
- Packet [2] = 37 (Is it Total no.of packets ??, it worked fine with other numbers too, idk what this exactly is)
- Packet [3] = i-1 (For ith packet sent)
- Packet [4] = 14 (except for last packet, i.e 37th one which has 8)
- Packet [19] = sum of all bytes (i.e from 0 - 18) % 256 
- Other
    - '2' means the key is configured to something
        - Like 02 00 00 usage_id (NA for lshift, rshift, lctrl, rctrl, lgui, lalt, ralt, fn)
    - '0' means the key is not configured to anything
- Multimedia 
    - USB HID Consumer Control
    - 234 => Vol down
    - 233 => Vol inc

- **No need to send all the packets, just send the packets in which the key is configured (let the packet[3] be the same, as if you have sent all the packets) and do not forget to send the last packet (the one that has packet[4] = 8)**