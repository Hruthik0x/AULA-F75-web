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

    
## Multimedia shortcuts 
- After every packet sent, wait for acknowledgement (acknowledgement data is same as the data sent)
- Total sent 37, received 37
- packet [0] = 19
- packet [1] = 1
- Packet [2] = 37 (Is it Total no.of packets ??)
- Packet [3] = i-1 (For ith packet sent)
- Packet [4] = 14 (Except for 37th packet, where it is 8)
- Packet [19] = sum of all bytes (i.e from 0 - 18) % 256 
- Other
    - '2' means the key is configured to something 
    - '0' means the key is not configured to anything
- Multimedia 
    - USB HID Consumer Control
    - 234 => Vol down
    - 233 => Vol inc
  