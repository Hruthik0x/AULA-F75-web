// Max length => 14
// Num rows => 37(36 are for config)
// Last row fixed

class KeySpec {
    constructor (id, row, column, type = KeyType.NORMAL){
        this.id = id; // ID of the key
        this.row = row; // Row in the matrix
        this.column = column; // Column in the matrix
    }
}

const MODIFIER_KEYS = new Set(["L_SHIFT", "R_SHIFT", "L_CTRL", "R_CTRL", "L_ALT", "L_GUI"]);
const FACTORY_KEYS = new Set(["FN"]);
const LAST_ROW = [0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x5a, 0xa5, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]

const KEYSPEC_MAP = {

    "ESC": KeySpec(0x29, 0, 0),
    "TILDE": KeySpec(0x35, 0, 4),
    "TAB": KeySpec(0x2B, 0, 8),
    "CAPS_LOCK": KeySpec(0x39, 0, 12),
    "L_SHIFT": KeySpec(0x02, 1, 2),
    "L_CTRL": KeySpec(0x01, 1, 6),
    // Idk why the 4 bytes padding 

    "1!": KeySpec(0x1E, 2, 0),
    "Q": KeySpec(0x14, 2, 4),
    "A": KeySpec(0x04, 2, 8),
    "Z": KeySpec(0x1D, 2, 12),
    "L_GUI": KeySpec(0x08, 3, 2),


    "F1": KeySpec(0x3A, 3, 6),
    "2@": KeySpec(0x1F, 3, 10),
    "W": KeySpec(0x1A, 4, 0),
    "S": KeySpec(0x16, 4, 4),
    "X": KeySpec(0x1B, 4, 8),
    "L_ALT": KeySpec(0x04, 4, 12),


    "F2": KeySpec(0x3B, 5, 2),
    "3#": KeySpec(0x20, 5, 6),
    "E": KeySpec(0x08, 5, 10),
    "D": KeySpec(0x07, 6, 0),
    "C": KeySpec(0x06, 6, 4),
    // 4 bytes padding, prolly for the space bar


    "F3": KeySpec(0x3C, 6, 12),
    "4$": KeySpec(0x21, 7, 2),
    "R": KeySpec(0x13, 7, 6),
    "F": KeySpec(0x09, 7, 10),
    "V": KeySpec(0x19, 8, 0),
    // 4 bytes padding, prolly for the space bar

    "F4": KeySpec(0x3D, 8, 8),
    "5%": KeySpec(0x22, 8, 12),
    "T": KeySpec(0x17, 9, 2),
    "G": KeySpec(0x0A, 9, 6),
    "B": KeySpec(0x05, 9, 10),
    "SPACE": KeySpec(0x2C, 10, 0),


    "F5": KeySpec(0x3E, 10, 4),
    "6^": KeySpec(0x23, 10, 8),
    "Y": KeySpec(0x1C, 10, 12),
    "H": KeySpec(0x0B, 11, 2),
    "N": KeySpec(0x12, 11, 6),
    // 4 bytes padding, prolly for the space bar

    "F6": KeySpec(0x3F, 12, 0),
    "7&": KeySpec(0x24, 12, 4),
    "U": KeySpec(0x18, 12, 8),
    "J": KeySpec(0x0C, 12, 12),
    "M": KeySpec(0x11, 13, 2),
    // 4 bytes padding, prolly for the space bar

    "F7": KeySpec(0x40, 13, 10),
    "8*": KeySpec(0x25, 14, 0),
    "I": KeySpec(0x0C, 14, 4),
    "K": KeySpec(0x0D, 14, 8),
    ",<": KeySpec(0x36, 14, 12),
    "FN": KeySpec(0x0D, 15, 2),

    
    "F8" : KeySpec(0x41, 15, 6),
    "9(": KeySpec(0x26, 15, 10),
    "O": KeySpec(0x12, 16, 0),
    "L": KeySpec(0x0F, 16, 4),
    ".>": KeySpec(0x37, 16, 8),
    "R_CTRL": KeySpec(0x10, 16, 12),


    "F9" : KeySpec(0x42, 17, 2),
    "0)": KeySpec(0x27, 17, 6),
    "P": KeySpec(0x13, 17, 10),
    ";:": KeySpec(0x33, 18, 0),
    "/?": KeySpec(0x38, 18, 4),
    // 4 bytes padding, idk why (Cuz no key down there ? or for R_ALT ?)
    
    "F10": KeySpec(0x43, 18, 12),
    "-_": KeySpec(0x2D, 19, 2),
    "[{": KeySpec(0x2F, 19, 6),
    "'\"": KeySpec(0x34, 19, 10),
    "R_SHIFT" : KeySpec(0x20, 20, 0),
    
    // 4 bytes padding, idk why
    "F11": KeySpec(0x44, 20, 8),
    "=+": KeySpec(0x2E, 20, 12),
    "]}": KeySpec(0x30, 21, 2),
    // 8 bytes padding, idk why
    "L_ARROW": KeySpec(0x50, 22, 0),
    
    "F12": KeySpec(0x45, 22, 4),
    "BACKSPACE": KeySpec(0x2A, 22, 8),
    "\|": KeySpec(0x31, 22, 12),
    "ENTER": KeySpec(0x28, 23, 2),
    "U_ARROW": KeySpec(0x52, 23, 6),
    "D_ARROW": KeySpec(0x51, 23, 10),

    // Have to deal with the 4 bytes, will work on it later -TODO
    "DELETE": KeySpec(0x4C, 24, 4),
    "PG_UP": KeySpec(0x4B, 24, 8),
    "PG_DN": KeySpec(0x4D, 24, 12),
    "END": KeySpec(0x4E, 25, 2),
    "R_ARROW": KeySpec(0x4F, 25, 6),
    
};

const HID_CONSUMER_CODES = {
    // --- Volume & Playback ---
    "VOL_INC": 0xE9,
    "VOL_DEC": 0xEA,
    "VOL_MUTE": 0xE2,
    "PLAY_PAUSE": 0xCD,
    "STOP": 0xB7,
    "PREV_TRACK": 0xB6,
    "NEXT_TRACK": 0xB5,
    "FAST_FORWARD": 0xB3,

    // --- Application Launch ---
    "LAUNCH_BROWSER": 0x196,       // Default browser
    "LAUNCH_MAIL": 0x18A,          // Default mail client
    "LAUNCH_CALCULATOR": 0x192,    // Calculator app
    "LAUNCH_MEDIA_PLAYER": 0x183,  // Default music/media player


    // Windows specific
    "LAUNCH_FILE_EXPLORER": 0x194, // "My Computer" → File Explorer / Finder / Nautilus
    "LAUNCH_SETTINGS": 0x19F,       // Control Panel / Settings / System Preferences

    // --- Browser Navigation ---
    "BROWSER_BACK": 0x224,
    "BROWSER_FORWARD": 0x225,
    "BROWSER_REFRESH": 0x227,
    "BROWSER_STOP": 0x226,
    "BROWSER_HOME": 0x223,
    "BROWSER_SEARCH": 0x221,

    // --- System ---
    "BRIGHTNESS_UP": 0x6F,
    "BRIGHTNESS_DOWN": 0x70,
    "SLEEP": 0x32,
    "POWER": 0x30,
    "WAKE": 0x31,
};

