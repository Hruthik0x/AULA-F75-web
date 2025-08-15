import pyshark
from os import path
from enum import Enum

DUMP_DATA_PATH = 'json_data'

class Direction(Enum) : 
    OUT = 0
    IN  = 1

class Utils: 

    @staticmethod
    def dump_data(data, file_path): 
        with open(file_path, "w") as f:
            f.write("[\n")
            for row_i, row in enumerate(data):
                formatted_numbers = ", ".join(f"{num:02x}" for num in row)
                f.write(f"  [{formatted_numbers}]")
                if row_i != len(data) - 1:
                    f.write(",\n")
                else:
                    f.write("\n")
            f.write("]\n")


class Multimedia:

    @staticmethod
    def process_pcapng(file_path):
        cap = pyshark.FileCapture(file_path)
        objs = [] 

        sent_packet_count = 0
        for packet in cap:
            data = None
            direc = None 
            
            if packet.length == '56':
                data = packet.layers[1].usb_data_fragment
                direc = Direction.OUT
                sent_packet_count += 1
            elif packet.length == '47':
                data = packet.layers[1].usb_capdata
                direc = Direction.IN

            if data:
                data = [int(x, 16) for x in data.split(':')]
                if direc == Direction.IN : 
                    assert data == objs[-1]
                else :
                    assert data[0] == 19
                    assert data[1] == 1
                    assert data[2] == 37
                    assert data[3] == sent_packet_count - 1
                    assert data[19] == sum(data[:19]) % 256
                    objs.append(data)

        for a in range(len(objs)) : 
            objs[a] = objs[a][4:]

        base_name = path.splitext(path.basename(file_path))[0]
        dump_path = path.join(DUMP_DATA_PATH, base_name + ".txt")
        Utils.dump_data(objs, dump_path)






        
def process_pcapng(file_path):
    cap = pyshark.FileCapture(file_path)
    objs = []

    # General 
    for packet in cap:
        data = None
        arr = None
        if packet.length == '56':
            arr = [0]
            data = packet.layers[1].usb_data_fragment
        elif packet.length == '47':
            arr = [1]
            data = packet.layers[1].usb_capdata

        if data:
            data = [int(x, 16) for x in data.split(':')]
            data = arr + data
            objs.append(data)

    # Get just filename without extension
    base_name = path.splitext(path.basename(file_path))[0]
    dump_path = path.join(DUMP_DATA_PATH, base_name + ".txt")
    Utils.dump_data(objs, dump_path)

if __name__ == "__main__":
    Multimedia.process_pcapng(file_path='pcapng/PgUp_ZoomIn_Command.pcapng')
