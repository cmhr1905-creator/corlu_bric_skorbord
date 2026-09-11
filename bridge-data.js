// OTOMATIK URETILDI - ELLE DUZENLEME.
// Kaynak: SKOR PUANLAMA.xlsx  |  Ureten: build_data.py
// Yeniden uretmek icin:  python3 build_data.py

// Yapan taraf skorlari. Anahtar: `${level}${strain}_${overtrick}`
const CONTRACT_SCORES = {
  "1C_0": {
    "level": 1,
    "strain": "C",
    "result": 0,
    "nonVul": {
      "normal": 70,
      "doubled": 140,
      "redoubled": 230
    },
    "vul": {
      "normal": 70,
      "doubled": 140,
      "redoubled": 230
    }
  },
  "1C_1": {
    "level": 1,
    "strain": "C",
    "result": 1,
    "nonVul": {
      "normal": 90,
      "doubled": 240,
      "redoubled": 430
    },
    "vul": {
      "normal": 90,
      "doubled": 340,
      "redoubled": 630
    }
  },
  "1C_2": {
    "level": 1,
    "strain": "C",
    "result": 2,
    "nonVul": {
      "normal": 110,
      "doubled": 340,
      "redoubled": 630
    },
    "vul": {
      "normal": 110,
      "doubled": 540,
      "redoubled": 1030
    }
  },
  "1C_3": {
    "level": 1,
    "strain": "C",
    "result": 3,
    "nonVul": {
      "normal": 130,
      "doubled": 440,
      "redoubled": 830
    },
    "vul": {
      "normal": 130,
      "doubled": 740,
      "redoubled": 1430
    }
  },
  "1C_4": {
    "level": 1,
    "strain": "C",
    "result": 4,
    "nonVul": {
      "normal": 150,
      "doubled": 540,
      "redoubled": 1030
    },
    "vul": {
      "normal": 150,
      "doubled": 940,
      "redoubled": 1830
    }
  },
  "1C_5": {
    "level": 1,
    "strain": "C",
    "result": 5,
    "nonVul": {
      "normal": 170,
      "doubled": 640,
      "redoubled": 1230
    },
    "vul": {
      "normal": 170,
      "doubled": 1140,
      "redoubled": 2230
    }
  },
  "1C_6": {
    "level": 1,
    "strain": "C",
    "result": 6,
    "nonVul": {
      "normal": 190,
      "doubled": 740,
      "redoubled": 1430
    },
    "vul": {
      "normal": 190,
      "doubled": 1340,
      "redoubled": 2630
    }
  },
  "1D_0": {
    "level": 1,
    "strain": "D",
    "result": 0,
    "nonVul": {
      "normal": 70,
      "doubled": 140,
      "redoubled": 230
    },
    "vul": {
      "normal": 70,
      "doubled": 140,
      "redoubled": 230
    }
  },
  "1D_1": {
    "level": 1,
    "strain": "D",
    "result": 1,
    "nonVul": {
      "normal": 90,
      "doubled": 240,
      "redoubled": 430
    },
    "vul": {
      "normal": 90,
      "doubled": 340,
      "redoubled": 630
    }
  },
  "1D_2": {
    "level": 1,
    "strain": "D",
    "result": 2,
    "nonVul": {
      "normal": 110,
      "doubled": 340,
      "redoubled": 630
    },
    "vul": {
      "normal": 110,
      "doubled": 540,
      "redoubled": 1030
    }
  },
  "1D_3": {
    "level": 1,
    "strain": "D",
    "result": 3,
    "nonVul": {
      "normal": 130,
      "doubled": 440,
      "redoubled": 830
    },
    "vul": {
      "normal": 130,
      "doubled": 740,
      "redoubled": 1430
    }
  },
  "1D_4": {
    "level": 1,
    "strain": "D",
    "result": 4,
    "nonVul": {
      "normal": 150,
      "doubled": 540,
      "redoubled": 1030
    },
    "vul": {
      "normal": 150,
      "doubled": 940,
      "redoubled": 1830
    }
  },
  "1D_5": {
    "level": 1,
    "strain": "D",
    "result": 5,
    "nonVul": {
      "normal": 170,
      "doubled": 640,
      "redoubled": 1230
    },
    "vul": {
      "normal": 170,
      "doubled": 1140,
      "redoubled": 2230
    }
  },
  "1D_6": {
    "level": 1,
    "strain": "D",
    "result": 6,
    "nonVul": {
      "normal": 190,
      "doubled": 740,
      "redoubled": 1430
    },
    "vul": {
      "normal": 190,
      "doubled": 1340,
      "redoubled": 2630
    }
  },
  "1H_0": {
    "level": 1,
    "strain": "H",
    "result": 0,
    "nonVul": {
      "normal": 80,
      "doubled": 160,
      "redoubled": 520
    },
    "vul": {
      "normal": 80,
      "doubled": 160,
      "redoubled": 720
    }
  },
  "1H_1": {
    "level": 1,
    "strain": "H",
    "result": 1,
    "nonVul": {
      "normal": 110,
      "doubled": 260,
      "redoubled": 720
    },
    "vul": {
      "normal": 110,
      "doubled": 360,
      "redoubled": 1120
    }
  },
  "1H_2": {
    "level": 1,
    "strain": "H",
    "result": 2,
    "nonVul": {
      "normal": 140,
      "doubled": 360,
      "redoubled": 920
    },
    "vul": {
      "normal": 140,
      "doubled": 560,
      "redoubled": 1520
    }
  },
  "1H_3": {
    "level": 1,
    "strain": "H",
    "result": 3,
    "nonVul": {
      "normal": 170,
      "doubled": 460,
      "redoubled": 1120
    },
    "vul": {
      "normal": 170,
      "doubled": 760,
      "redoubled": 1920
    }
  },
  "1H_4": {
    "level": 1,
    "strain": "H",
    "result": 4,
    "nonVul": {
      "normal": 200,
      "doubled": 560,
      "redoubled": 1320
    },
    "vul": {
      "normal": 200,
      "doubled": 960,
      "redoubled": 2320
    }
  },
  "1H_5": {
    "level": 1,
    "strain": "H",
    "result": 5,
    "nonVul": {
      "normal": 230,
      "doubled": 660,
      "redoubled": 1520
    },
    "vul": {
      "normal": 230,
      "doubled": 1160,
      "redoubled": 2720
    }
  },
  "1H_6": {
    "level": 1,
    "strain": "H",
    "result": 6,
    "nonVul": {
      "normal": 260,
      "doubled": 760,
      "redoubled": 1720
    },
    "vul": {
      "normal": 260,
      "doubled": 1360,
      "redoubled": 3120
    }
  },
  "1S_0": {
    "level": 1,
    "strain": "S",
    "result": 0,
    "nonVul": {
      "normal": 80,
      "doubled": 160,
      "redoubled": 520
    },
    "vul": {
      "normal": 80,
      "doubled": 160,
      "redoubled": 720
    }
  },
  "1S_1": {
    "level": 1,
    "strain": "S",
    "result": 1,
    "nonVul": {
      "normal": 110,
      "doubled": 260,
      "redoubled": 720
    },
    "vul": {
      "normal": 110,
      "doubled": 360,
      "redoubled": 1120
    }
  },
  "1S_2": {
    "level": 1,
    "strain": "S",
    "result": 2,
    "nonVul": {
      "normal": 140,
      "doubled": 360,
      "redoubled": 920
    },
    "vul": {
      "normal": 140,
      "doubled": 560,
      "redoubled": 1520
    }
  },
  "1S_3": {
    "level": 1,
    "strain": "S",
    "result": 3,
    "nonVul": {
      "normal": 170,
      "doubled": 460,
      "redoubled": 1120
    },
    "vul": {
      "normal": 170,
      "doubled": 760,
      "redoubled": 1920
    }
  },
  "1S_4": {
    "level": 1,
    "strain": "S",
    "result": 4,
    "nonVul": {
      "normal": 200,
      "doubled": 560,
      "redoubled": 1320
    },
    "vul": {
      "normal": 200,
      "doubled": 960,
      "redoubled": 2320
    }
  },
  "1S_5": {
    "level": 1,
    "strain": "S",
    "result": 5,
    "nonVul": {
      "normal": 230,
      "doubled": 660,
      "redoubled": 1520
    },
    "vul": {
      "normal": 230,
      "doubled": 1160,
      "redoubled": 2720
    }
  },
  "1S_6": {
    "level": 1,
    "strain": "S",
    "result": 6,
    "nonVul": {
      "normal": 260,
      "doubled": 760,
      "redoubled": 1720
    },
    "vul": {
      "normal": 260,
      "doubled": 1360,
      "redoubled": 3120
    }
  },
  "1NT_0": {
    "level": 1,
    "strain": "NT",
    "result": 0,
    "nonVul": {
      "normal": 90,
      "doubled": 180,
      "redoubled": 560
    },
    "vul": {
      "normal": 90,
      "doubled": 180,
      "redoubled": 760
    }
  },
  "1NT_1": {
    "level": 1,
    "strain": "NT",
    "result": 1,
    "nonVul": {
      "normal": 120,
      "doubled": 280,
      "redoubled": 760
    },
    "vul": {
      "normal": 120,
      "doubled": 380,
      "redoubled": 1160
    }
  },
  "1NT_2": {
    "level": 1,
    "strain": "NT",
    "result": 2,
    "nonVul": {
      "normal": 150,
      "doubled": 380,
      "redoubled": 960
    },
    "vul": {
      "normal": 150,
      "doubled": 580,
      "redoubled": 1560
    }
  },
  "1NT_3": {
    "level": 1,
    "strain": "NT",
    "result": 3,
    "nonVul": {
      "normal": 180,
      "doubled": 480,
      "redoubled": 1160
    },
    "vul": {
      "normal": 180,
      "doubled": 780,
      "redoubled": 1960
    }
  },
  "1NT_4": {
    "level": 1,
    "strain": "NT",
    "result": 4,
    "nonVul": {
      "normal": 210,
      "doubled": 580,
      "redoubled": 1360
    },
    "vul": {
      "normal": 210,
      "doubled": 980,
      "redoubled": 2360
    }
  },
  "1NT_5": {
    "level": 1,
    "strain": "NT",
    "result": 5,
    "nonVul": {
      "normal": 240,
      "doubled": 680,
      "redoubled": 1560
    },
    "vul": {
      "normal": 240,
      "doubled": 1180,
      "redoubled": 2760
    }
  },
  "1NT_6": {
    "level": 1,
    "strain": "NT",
    "result": 6,
    "nonVul": {
      "normal": 270,
      "doubled": 780,
      "redoubled": 1760
    },
    "vul": {
      "normal": 270,
      "doubled": 1380,
      "redoubled": 3160
    }
  },
  "2C_0": {
    "level": 2,
    "strain": "C",
    "result": 0,
    "nonVul": {
      "normal": 90,
      "doubled": 180,
      "redoubled": 560
    },
    "vul": {
      "normal": 90,
      "doubled": 180,
      "redoubled": 760
    }
  },
  "2C_1": {
    "level": 2,
    "strain": "C",
    "result": 1,
    "nonVul": {
      "normal": 110,
      "doubled": 280,
      "redoubled": 760
    },
    "vul": {
      "normal": 110,
      "doubled": 380,
      "redoubled": 1160
    }
  },
  "2C_2": {
    "level": 2,
    "strain": "C",
    "result": 2,
    "nonVul": {
      "normal": 130,
      "doubled": 380,
      "redoubled": 960
    },
    "vul": {
      "normal": 130,
      "doubled": 580,
      "redoubled": 1560
    }
  },
  "2C_3": {
    "level": 2,
    "strain": "C",
    "result": 3,
    "nonVul": {
      "normal": 150,
      "doubled": 480,
      "redoubled": 1160
    },
    "vul": {
      "normal": 150,
      "doubled": 780,
      "redoubled": 1960
    }
  },
  "2C_4": {
    "level": 2,
    "strain": "C",
    "result": 4,
    "nonVul": {
      "normal": 170,
      "doubled": 580,
      "redoubled": 1360
    },
    "vul": {
      "normal": 170,
      "doubled": 980,
      "redoubled": 2360
    }
  },
  "2C_5": {
    "level": 2,
    "strain": "C",
    "result": 5,
    "nonVul": {
      "normal": 190,
      "doubled": 680,
      "redoubled": 1560
    },
    "vul": {
      "normal": 190,
      "doubled": 1180,
      "redoubled": 2760
    }
  },
  "2D_0": {
    "level": 2,
    "strain": "D",
    "result": 0,
    "nonVul": {
      "normal": 90,
      "doubled": 180,
      "redoubled": 560
    },
    "vul": {
      "normal": 90,
      "doubled": 180,
      "redoubled": 760
    }
  },
  "2D_1": {
    "level": 2,
    "strain": "D",
    "result": 1,
    "nonVul": {
      "normal": 110,
      "doubled": 280,
      "redoubled": 760
    },
    "vul": {
      "normal": 110,
      "doubled": 380,
      "redoubled": 1160
    }
  },
  "2D_2": {
    "level": 2,
    "strain": "D",
    "result": 2,
    "nonVul": {
      "normal": 130,
      "doubled": 380,
      "redoubled": 960
    },
    "vul": {
      "normal": 130,
      "doubled": 580,
      "redoubled": 1560
    }
  },
  "2D_3": {
    "level": 2,
    "strain": "D",
    "result": 3,
    "nonVul": {
      "normal": 150,
      "doubled": 480,
      "redoubled": 1160
    },
    "vul": {
      "normal": 150,
      "doubled": 780,
      "redoubled": 1960
    }
  },
  "2D_4": {
    "level": 2,
    "strain": "D",
    "result": 4,
    "nonVul": {
      "normal": 170,
      "doubled": 580,
      "redoubled": 1360
    },
    "vul": {
      "normal": 170,
      "doubled": 980,
      "redoubled": 2360
    }
  },
  "2D_5": {
    "level": 2,
    "strain": "D",
    "result": 5,
    "nonVul": {
      "normal": 190,
      "doubled": 680,
      "redoubled": 1560
    },
    "vul": {
      "normal": 190,
      "doubled": 1180,
      "redoubled": 2760
    }
  },
  "2H_0": {
    "level": 2,
    "strain": "H",
    "result": 0,
    "nonVul": {
      "normal": 110,
      "doubled": 470,
      "redoubled": 640
    },
    "vul": {
      "normal": 110,
      "doubled": 670,
      "redoubled": 840
    }
  },
  "2H_1": {
    "level": 2,
    "strain": "H",
    "result": 1,
    "nonVul": {
      "normal": 140,
      "doubled": 570,
      "redoubled": 840
    },
    "vul": {
      "normal": 140,
      "doubled": 870,
      "redoubled": 1240
    }
  },
  "2H_2": {
    "level": 2,
    "strain": "H",
    "result": 2,
    "nonVul": {
      "normal": 170,
      "doubled": 670,
      "redoubled": 1040
    },
    "vul": {
      "normal": 170,
      "doubled": 1070,
      "redoubled": 1640
    }
  },
  "2H_3": {
    "level": 2,
    "strain": "H",
    "result": 3,
    "nonVul": {
      "normal": 200,
      "doubled": 770,
      "redoubled": 1240
    },
    "vul": {
      "normal": 200,
      "doubled": 1270,
      "redoubled": 2040
    }
  },
  "2H_4": {
    "level": 2,
    "strain": "H",
    "result": 4,
    "nonVul": {
      "normal": 230,
      "doubled": 870,
      "redoubled": 1440
    },
    "vul": {
      "normal": 230,
      "doubled": 1470,
      "redoubled": 2440
    }
  },
  "2H_5": {
    "level": 2,
    "strain": "H",
    "result": 5,
    "nonVul": {
      "normal": 260,
      "doubled": 970,
      "redoubled": 1640
    },
    "vul": {
      "normal": 260,
      "doubled": 1670,
      "redoubled": 2840
    }
  },
  "2S_0": {
    "level": 2,
    "strain": "S",
    "result": 0,
    "nonVul": {
      "normal": 110,
      "doubled": 470,
      "redoubled": 640
    },
    "vul": {
      "normal": 110,
      "doubled": 670,
      "redoubled": 840
    }
  },
  "2S_1": {
    "level": 2,
    "strain": "S",
    "result": 1,
    "nonVul": {
      "normal": 140,
      "doubled": 570,
      "redoubled": 840
    },
    "vul": {
      "normal": 140,
      "doubled": 870,
      "redoubled": 1240
    }
  },
  "2S_2": {
    "level": 2,
    "strain": "S",
    "result": 2,
    "nonVul": {
      "normal": 170,
      "doubled": 670,
      "redoubled": 1040
    },
    "vul": {
      "normal": 170,
      "doubled": 1070,
      "redoubled": 1640
    }
  },
  "2S_3": {
    "level": 2,
    "strain": "S",
    "result": 3,
    "nonVul": {
      "normal": 200,
      "doubled": 770,
      "redoubled": 1240
    },
    "vul": {
      "normal": 200,
      "doubled": 1270,
      "redoubled": 2040
    }
  },
  "2S_4": {
    "level": 2,
    "strain": "S",
    "result": 4,
    "nonVul": {
      "normal": 230,
      "doubled": 870,
      "redoubled": 1440
    },
    "vul": {
      "normal": 230,
      "doubled": 1470,
      "redoubled": 2440
    }
  },
  "2S_5": {
    "level": 2,
    "strain": "S",
    "result": 5,
    "nonVul": {
      "normal": 260,
      "doubled": 970,
      "redoubled": 1640
    },
    "vul": {
      "normal": 260,
      "doubled": 1670,
      "redoubled": 2840
    }
  },
  "2NT_0": {
    "level": 2,
    "strain": "NT",
    "result": 0,
    "nonVul": {
      "normal": 120,
      "doubled": 490,
      "redoubled": 680
    },
    "vul": {
      "normal": 120,
      "doubled": 690,
      "redoubled": 880
    }
  },
  "2NT_1": {
    "level": 2,
    "strain": "NT",
    "result": 1,
    "nonVul": {
      "normal": 150,
      "doubled": 590,
      "redoubled": 880
    },
    "vul": {
      "normal": 150,
      "doubled": 890,
      "redoubled": 1280
    }
  },
  "2NT_2": {
    "level": 2,
    "strain": "NT",
    "result": 2,
    "nonVul": {
      "normal": 180,
      "doubled": 690,
      "redoubled": 1080
    },
    "vul": {
      "normal": 180,
      "doubled": 1090,
      "redoubled": 1680
    }
  },
  "2NT_3": {
    "level": 2,
    "strain": "NT",
    "result": 3,
    "nonVul": {
      "normal": 210,
      "doubled": 790,
      "redoubled": 1280
    },
    "vul": {
      "normal": 210,
      "doubled": 1290,
      "redoubled": 2080
    }
  },
  "2NT_4": {
    "level": 2,
    "strain": "NT",
    "result": 4,
    "nonVul": {
      "normal": 240,
      "doubled": 890,
      "redoubled": 1480
    },
    "vul": {
      "normal": 240,
      "doubled": 1490,
      "redoubled": 2480
    }
  },
  "2NT_5": {
    "level": 2,
    "strain": "NT",
    "result": 5,
    "nonVul": {
      "normal": 270,
      "doubled": 990,
      "redoubled": 1680
    },
    "vul": {
      "normal": 270,
      "doubled": 1690,
      "redoubled": 2880
    }
  },
  "3C_0": {
    "level": 3,
    "strain": "C",
    "result": 0,
    "nonVul": {
      "normal": 110,
      "doubled": 470,
      "redoubled": 640
    },
    "vul": {
      "normal": 110,
      "doubled": 670,
      "redoubled": 840
    }
  },
  "3C_1": {
    "level": 3,
    "strain": "C",
    "result": 1,
    "nonVul": {
      "normal": 130,
      "doubled": 570,
      "redoubled": 840
    },
    "vul": {
      "normal": 130,
      "doubled": 870,
      "redoubled": 1240
    }
  },
  "3C_2": {
    "level": 3,
    "strain": "C",
    "result": 2,
    "nonVul": {
      "normal": 150,
      "doubled": 670,
      "redoubled": 1040
    },
    "vul": {
      "normal": 150,
      "doubled": 1070,
      "redoubled": 1640
    }
  },
  "3C_3": {
    "level": 3,
    "strain": "C",
    "result": 3,
    "nonVul": {
      "normal": 170,
      "doubled": 770,
      "redoubled": 1240
    },
    "vul": {
      "normal": 170,
      "doubled": 1270,
      "redoubled": 2040
    }
  },
  "3C_4": {
    "level": 3,
    "strain": "C",
    "result": 4,
    "nonVul": {
      "normal": 190,
      "doubled": 870,
      "redoubled": 1440
    },
    "vul": {
      "normal": 190,
      "doubled": 1470,
      "redoubled": 2440
    }
  },
  "3D_0": {
    "level": 3,
    "strain": "D",
    "result": 0,
    "nonVul": {
      "normal": 110,
      "doubled": 470,
      "redoubled": 640
    },
    "vul": {
      "normal": 110,
      "doubled": 670,
      "redoubled": 840
    }
  },
  "3D_1": {
    "level": 3,
    "strain": "D",
    "result": 1,
    "nonVul": {
      "normal": 130,
      "doubled": 570,
      "redoubled": 840
    },
    "vul": {
      "normal": 130,
      "doubled": 870,
      "redoubled": 1240
    }
  },
  "3D_2": {
    "level": 3,
    "strain": "D",
    "result": 2,
    "nonVul": {
      "normal": 150,
      "doubled": 670,
      "redoubled": 1040
    },
    "vul": {
      "normal": 150,
      "doubled": 1070,
      "redoubled": 1640
    }
  },
  "3D_3": {
    "level": 3,
    "strain": "D",
    "result": 3,
    "nonVul": {
      "normal": 170,
      "doubled": 770,
      "redoubled": 1240
    },
    "vul": {
      "normal": 170,
      "doubled": 1270,
      "redoubled": 2040
    }
  },
  "3D_4": {
    "level": 3,
    "strain": "D",
    "result": 4,
    "nonVul": {
      "normal": 190,
      "doubled": 870,
      "redoubled": 1440
    },
    "vul": {
      "normal": 190,
      "doubled": 1470,
      "redoubled": 2440
    }
  },
  "3H_0": {
    "level": 3,
    "strain": "H",
    "result": 0,
    "nonVul": {
      "normal": 140,
      "doubled": 530,
      "redoubled": 760
    },
    "vul": {
      "normal": 140,
      "doubled": 730,
      "redoubled": 960
    }
  },
  "3H_1": {
    "level": 3,
    "strain": "H",
    "result": 1,
    "nonVul": {
      "normal": 170,
      "doubled": 630,
      "redoubled": 960
    },
    "vul": {
      "normal": 170,
      "doubled": 930,
      "redoubled": 1360
    }
  },
  "3H_2": {
    "level": 3,
    "strain": "H",
    "result": 2,
    "nonVul": {
      "normal": 200,
      "doubled": 730,
      "redoubled": 1160
    },
    "vul": {
      "normal": 200,
      "doubled": 1130,
      "redoubled": 1760
    }
  },
  "3H_3": {
    "level": 3,
    "strain": "H",
    "result": 3,
    "nonVul": {
      "normal": 230,
      "doubled": 830,
      "redoubled": 1360
    },
    "vul": {
      "normal": 230,
      "doubled": 1330,
      "redoubled": 2160
    }
  },
  "3H_4": {
    "level": 3,
    "strain": "H",
    "result": 4,
    "nonVul": {
      "normal": 260,
      "doubled": 930,
      "redoubled": 1560
    },
    "vul": {
      "normal": 260,
      "doubled": 1530,
      "redoubled": 2560
    }
  },
  "3S_0": {
    "level": 3,
    "strain": "S",
    "result": 0,
    "nonVul": {
      "normal": 140,
      "doubled": 530,
      "redoubled": 760
    },
    "vul": {
      "normal": 140,
      "doubled": 730,
      "redoubled": 960
    }
  },
  "3S_1": {
    "level": 3,
    "strain": "S",
    "result": 1,
    "nonVul": {
      "normal": 170,
      "doubled": 630,
      "redoubled": 960
    },
    "vul": {
      "normal": 170,
      "doubled": 930,
      "redoubled": 1360
    }
  },
  "3S_2": {
    "level": 3,
    "strain": "S",
    "result": 2,
    "nonVul": {
      "normal": 200,
      "doubled": 730,
      "redoubled": 1160
    },
    "vul": {
      "normal": 200,
      "doubled": 1130,
      "redoubled": 1760
    }
  },
  "3S_3": {
    "level": 3,
    "strain": "S",
    "result": 3,
    "nonVul": {
      "normal": 230,
      "doubled": 830,
      "redoubled": 1360
    },
    "vul": {
      "normal": 230,
      "doubled": 1330,
      "redoubled": 2160
    }
  },
  "3S_4": {
    "level": 3,
    "strain": "S",
    "result": 4,
    "nonVul": {
      "normal": 260,
      "doubled": 930,
      "redoubled": 1560
    },
    "vul": {
      "normal": 260,
      "doubled": 1530,
      "redoubled": 2560
    }
  },
  "3NT_0": {
    "level": 3,
    "strain": "NT",
    "result": 0,
    "nonVul": {
      "normal": 400,
      "doubled": 550,
      "redoubled": 800
    },
    "vul": {
      "normal": 600,
      "doubled": 750,
      "redoubled": 1000
    }
  },
  "3NT_1": {
    "level": 3,
    "strain": "NT",
    "result": 1,
    "nonVul": {
      "normal": 430,
      "doubled": 650,
      "redoubled": 1000
    },
    "vul": {
      "normal": 630,
      "doubled": 950,
      "redoubled": 1400
    }
  },
  "3NT_2": {
    "level": 3,
    "strain": "NT",
    "result": 2,
    "nonVul": {
      "normal": 460,
      "doubled": 750,
      "redoubled": 1200
    },
    "vul": {
      "normal": 660,
      "doubled": 1150,
      "redoubled": 1800
    }
  },
  "3NT_3": {
    "level": 3,
    "strain": "NT",
    "result": 3,
    "nonVul": {
      "normal": 490,
      "doubled": 850,
      "redoubled": 1400
    },
    "vul": {
      "normal": 690,
      "doubled": 1350,
      "redoubled": 2200
    }
  },
  "3NT_4": {
    "level": 3,
    "strain": "NT",
    "result": 4,
    "nonVul": {
      "normal": 520,
      "doubled": 950,
      "redoubled": 1600
    },
    "vul": {
      "normal": 720,
      "doubled": 1550,
      "redoubled": 2600
    }
  },
  "4C_0": {
    "level": 4,
    "strain": "C",
    "result": 0,
    "nonVul": {
      "normal": 130,
      "doubled": 510,
      "redoubled": 720
    },
    "vul": {
      "normal": 130,
      "doubled": 710,
      "redoubled": 920
    }
  },
  "4C_1": {
    "level": 4,
    "strain": "C",
    "result": 1,
    "nonVul": {
      "normal": 150,
      "doubled": 610,
      "redoubled": 920
    },
    "vul": {
      "normal": 150,
      "doubled": 910,
      "redoubled": 1320
    }
  },
  "4C_2": {
    "level": 4,
    "strain": "C",
    "result": 2,
    "nonVul": {
      "normal": 170,
      "doubled": 710,
      "redoubled": 1120
    },
    "vul": {
      "normal": 170,
      "doubled": 1110,
      "redoubled": 1720
    }
  },
  "4C_3": {
    "level": 4,
    "strain": "C",
    "result": 3,
    "nonVul": {
      "normal": 190,
      "doubled": 810,
      "redoubled": 1320
    },
    "vul": {
      "normal": 190,
      "doubled": 1310,
      "redoubled": 2120
    }
  },
  "4D_0": {
    "level": 4,
    "strain": "D",
    "result": 0,
    "nonVul": {
      "normal": 130,
      "doubled": 510,
      "redoubled": 720
    },
    "vul": {
      "normal": 130,
      "doubled": 710,
      "redoubled": 920
    }
  },
  "4D_1": {
    "level": 4,
    "strain": "D",
    "result": 1,
    "nonVul": {
      "normal": 150,
      "doubled": 610,
      "redoubled": 920
    },
    "vul": {
      "normal": 150,
      "doubled": 910,
      "redoubled": 1320
    }
  },
  "4D_2": {
    "level": 4,
    "strain": "D",
    "result": 2,
    "nonVul": {
      "normal": 170,
      "doubled": 710,
      "redoubled": 1120
    },
    "vul": {
      "normal": 170,
      "doubled": 1110,
      "redoubled": 1720
    }
  },
  "4D_3": {
    "level": 4,
    "strain": "D",
    "result": 3,
    "nonVul": {
      "normal": 190,
      "doubled": 810,
      "redoubled": 1320
    },
    "vul": {
      "normal": 190,
      "doubled": 1310,
      "redoubled": 2120
    }
  },
  "4H_0": {
    "level": 4,
    "strain": "H",
    "result": 0,
    "nonVul": {
      "normal": 420,
      "doubled": 590,
      "redoubled": 880
    },
    "vul": {
      "normal": 620,
      "doubled": 790,
      "redoubled": 1080
    }
  },
  "4H_1": {
    "level": 4,
    "strain": "H",
    "result": 1,
    "nonVul": {
      "normal": 450,
      "doubled": 690,
      "redoubled": 1080
    },
    "vul": {
      "normal": 650,
      "doubled": 990,
      "redoubled": 1480
    }
  },
  "4H_2": {
    "level": 4,
    "strain": "H",
    "result": 2,
    "nonVul": {
      "normal": 480,
      "doubled": 790,
      "redoubled": 1280
    },
    "vul": {
      "normal": 680,
      "doubled": 1190,
      "redoubled": 1880
    }
  },
  "4H_3": {
    "level": 4,
    "strain": "H",
    "result": 3,
    "nonVul": {
      "normal": 510,
      "doubled": 890,
      "redoubled": 1480
    },
    "vul": {
      "normal": 710,
      "doubled": 1390,
      "redoubled": 2280
    }
  },
  "4S_0": {
    "level": 4,
    "strain": "S",
    "result": 0,
    "nonVul": {
      "normal": 420,
      "doubled": 590,
      "redoubled": 880
    },
    "vul": {
      "normal": 620,
      "doubled": 790,
      "redoubled": 1080
    }
  },
  "4S_1": {
    "level": 4,
    "strain": "S",
    "result": 1,
    "nonVul": {
      "normal": 450,
      "doubled": 690,
      "redoubled": 1080
    },
    "vul": {
      "normal": 650,
      "doubled": 990,
      "redoubled": 1480
    }
  },
  "4S_2": {
    "level": 4,
    "strain": "S",
    "result": 2,
    "nonVul": {
      "normal": 480,
      "doubled": 790,
      "redoubled": 1280
    },
    "vul": {
      "normal": 680,
      "doubled": 1190,
      "redoubled": 1880
    }
  },
  "4S_3": {
    "level": 4,
    "strain": "S",
    "result": 3,
    "nonVul": {
      "normal": 510,
      "doubled": 890,
      "redoubled": 1480
    },
    "vul": {
      "normal": 710,
      "doubled": 1390,
      "redoubled": 2280
    }
  },
  "4NT_0": {
    "level": 4,
    "strain": "NT",
    "result": 0,
    "nonVul": {
      "normal": 430,
      "doubled": 610,
      "redoubled": 920
    },
    "vul": {
      "normal": 630,
      "doubled": 810,
      "redoubled": 1120
    }
  },
  "4NT_1": {
    "level": 4,
    "strain": "NT",
    "result": 1,
    "nonVul": {
      "normal": 460,
      "doubled": 710,
      "redoubled": 1120
    },
    "vul": {
      "normal": 660,
      "doubled": 1010,
      "redoubled": 1520
    }
  },
  "4NT_2": {
    "level": 4,
    "strain": "NT",
    "result": 2,
    "nonVul": {
      "normal": 490,
      "doubled": 810,
      "redoubled": 1320
    },
    "vul": {
      "normal": 690,
      "doubled": 1210,
      "redoubled": 1920
    }
  },
  "4NT_3": {
    "level": 4,
    "strain": "NT",
    "result": 3,
    "nonVul": {
      "normal": 520,
      "doubled": 910,
      "redoubled": 1520
    },
    "vul": {
      "normal": 720,
      "doubled": 1410,
      "redoubled": 2320
    }
  },
  "5C_0": {
    "level": 5,
    "strain": "C",
    "result": 0,
    "nonVul": {
      "normal": 400,
      "doubled": 550,
      "redoubled": 800
    },
    "vul": {
      "normal": 600,
      "doubled": 750,
      "redoubled": 1000
    }
  },
  "5C_1": {
    "level": 5,
    "strain": "C",
    "result": 1,
    "nonVul": {
      "normal": 420,
      "doubled": 650,
      "redoubled": 1000
    },
    "vul": {
      "normal": 620,
      "doubled": 950,
      "redoubled": 1400
    }
  },
  "5C_2": {
    "level": 5,
    "strain": "C",
    "result": 2,
    "nonVul": {
      "normal": 440,
      "doubled": 750,
      "redoubled": 1200
    },
    "vul": {
      "normal": 640,
      "doubled": 1150,
      "redoubled": 1800
    }
  },
  "5D_0": {
    "level": 5,
    "strain": "D",
    "result": 0,
    "nonVul": {
      "normal": 400,
      "doubled": 550,
      "redoubled": 800
    },
    "vul": {
      "normal": 600,
      "doubled": 750,
      "redoubled": 1000
    }
  },
  "5D_1": {
    "level": 5,
    "strain": "D",
    "result": 1,
    "nonVul": {
      "normal": 420,
      "doubled": 650,
      "redoubled": 1000
    },
    "vul": {
      "normal": 620,
      "doubled": 950,
      "redoubled": 1400
    }
  },
  "5D_2": {
    "level": 5,
    "strain": "D",
    "result": 2,
    "nonVul": {
      "normal": 440,
      "doubled": 750,
      "redoubled": 1200
    },
    "vul": {
      "normal": 640,
      "doubled": 1150,
      "redoubled": 1800
    }
  },
  "5H_0": {
    "level": 5,
    "strain": "H",
    "result": 0,
    "nonVul": {
      "normal": 450,
      "doubled": 650,
      "redoubled": 1000
    },
    "vul": {
      "normal": 650,
      "doubled": 850,
      "redoubled": 1200
    }
  },
  "5H_1": {
    "level": 5,
    "strain": "H",
    "result": 1,
    "nonVul": {
      "normal": 480,
      "doubled": 750,
      "redoubled": 1200
    },
    "vul": {
      "normal": 680,
      "doubled": 1050,
      "redoubled": 1600
    }
  },
  "5H_2": {
    "level": 5,
    "strain": "H",
    "result": 2,
    "nonVul": {
      "normal": 510,
      "doubled": 850,
      "redoubled": 1400
    },
    "vul": {
      "normal": 710,
      "doubled": 1250,
      "redoubled": 2000
    }
  },
  "5S_0": {
    "level": 5,
    "strain": "S",
    "result": 0,
    "nonVul": {
      "normal": 450,
      "doubled": 650,
      "redoubled": 1000
    },
    "vul": {
      "normal": 650,
      "doubled": 850,
      "redoubled": 1200
    }
  },
  "5S_1": {
    "level": 5,
    "strain": "S",
    "result": 1,
    "nonVul": {
      "normal": 480,
      "doubled": 750,
      "redoubled": 1200
    },
    "vul": {
      "normal": 680,
      "doubled": 1050,
      "redoubled": 1600
    }
  },
  "5S_2": {
    "level": 5,
    "strain": "S",
    "result": 2,
    "nonVul": {
      "normal": 510,
      "doubled": 850,
      "redoubled": 1400
    },
    "vul": {
      "normal": 710,
      "doubled": 1250,
      "redoubled": 2000
    }
  },
  "5NT_0": {
    "level": 5,
    "strain": "NT",
    "result": 0,
    "nonVul": {
      "normal": 460,
      "doubled": 670,
      "redoubled": 1040
    },
    "vul": {
      "normal": 660,
      "doubled": 870,
      "redoubled": 1240
    }
  },
  "5NT_1": {
    "level": 5,
    "strain": "NT",
    "result": 1,
    "nonVul": {
      "normal": 490,
      "doubled": 770,
      "redoubled": 1240
    },
    "vul": {
      "normal": 690,
      "doubled": 1070,
      "redoubled": 1640
    }
  },
  "5NT_2": {
    "level": 5,
    "strain": "NT",
    "result": 2,
    "nonVul": {
      "normal": 520,
      "doubled": 870,
      "redoubled": 1440
    },
    "vul": {
      "normal": 720,
      "doubled": 1270,
      "redoubled": 2040
    }
  },
  "6C_0": {
    "level": 6,
    "strain": "C",
    "result": 0,
    "nonVul": {
      "normal": 920,
      "doubled": 1090,
      "redoubled": 1380
    },
    "vul": {
      "normal": 1370,
      "doubled": 1540,
      "redoubled": 1830
    }
  },
  "6C_1": {
    "level": 6,
    "strain": "C",
    "result": 1,
    "nonVul": {
      "normal": 940,
      "doubled": 1190,
      "redoubled": 1580
    },
    "vul": {
      "normal": 1390,
      "doubled": 1740,
      "redoubled": 2230
    }
  },
  "6D_0": {
    "level": 6,
    "strain": "D",
    "result": 0,
    "nonVul": {
      "normal": 920,
      "doubled": 1090,
      "redoubled": 1380
    },
    "vul": {
      "normal": 1370,
      "doubled": 1540,
      "redoubled": 1830
    }
  },
  "6D_1": {
    "level": 6,
    "strain": "D",
    "result": 1,
    "nonVul": {
      "normal": 940,
      "doubled": 1190,
      "redoubled": 1580
    },
    "vul": {
      "normal": 1390,
      "doubled": 1740,
      "redoubled": 2230
    }
  },
  "6H_0": {
    "level": 6,
    "strain": "H",
    "result": 0,
    "nonVul": {
      "normal": 980,
      "doubled": 1210,
      "redoubled": 1620
    },
    "vul": {
      "normal": 1430,
      "doubled": 1660,
      "redoubled": 2070
    }
  },
  "6H_1": {
    "level": 6,
    "strain": "H",
    "result": 1,
    "nonVul": {
      "normal": 1010,
      "doubled": 1310,
      "redoubled": 1820
    },
    "vul": {
      "normal": 1460,
      "doubled": 1860,
      "redoubled": 2470
    }
  },
  "6S_0": {
    "level": 6,
    "strain": "S",
    "result": 0,
    "nonVul": {
      "normal": 980,
      "doubled": 1210,
      "redoubled": 1620
    },
    "vul": {
      "normal": 1430,
      "doubled": 1660,
      "redoubled": 2070
    }
  },
  "6S_1": {
    "level": 6,
    "strain": "S",
    "result": 1,
    "nonVul": {
      "normal": 1010,
      "doubled": 1310,
      "redoubled": 1820
    },
    "vul": {
      "normal": 1460,
      "doubled": 1860,
      "redoubled": 2470
    }
  },
  "6NT_0": {
    "level": 6,
    "strain": "NT",
    "result": 0,
    "nonVul": {
      "normal": 990,
      "doubled": 1230,
      "redoubled": 1660
    },
    "vul": {
      "normal": 1440,
      "doubled": 1680,
      "redoubled": 2110
    }
  },
  "6NT_1": {
    "level": 6,
    "strain": "NT",
    "result": 1,
    "nonVul": {
      "normal": 1020,
      "doubled": 1330,
      "redoubled": 1860
    },
    "vul": {
      "normal": 1470,
      "doubled": 1880,
      "redoubled": 2510
    }
  },
  "7C_0": {
    "level": 7,
    "strain": "C",
    "result": 0,
    "nonVul": {
      "normal": 1440,
      "doubled": 1630,
      "redoubled": 1960
    },
    "vul": {
      "normal": 2140,
      "doubled": 2330,
      "redoubled": 2660
    }
  },
  "7D_0": {
    "level": 7,
    "strain": "D",
    "result": 0,
    "nonVul": {
      "normal": 1440,
      "doubled": 1630,
      "redoubled": 1960
    },
    "vul": {
      "normal": 2140,
      "doubled": 2330,
      "redoubled": 2660
    }
  },
  "7H_0": {
    "level": 7,
    "strain": "H",
    "result": 0,
    "nonVul": {
      "normal": 1510,
      "doubled": 1770,
      "redoubled": 2240
    },
    "vul": {
      "normal": 2210,
      "doubled": 2470,
      "redoubled": 2940
    }
  },
  "7S_0": {
    "level": 7,
    "strain": "S",
    "result": 0,
    "nonVul": {
      "normal": 1510,
      "doubled": 1770,
      "redoubled": 2240
    },
    "vul": {
      "normal": 2210,
      "doubled": 2470,
      "redoubled": 2940
    }
  },
  "7NT_0": {
    "level": 7,
    "strain": "NT",
    "result": 0,
    "nonVul": {
      "normal": 1520,
      "doubled": 1790,
      "redoubled": 2280
    },
    "vul": {
      "normal": 2220,
      "doubled": 2490,
      "redoubled": 2980
    }
  }
};

// Batak cezalari (pozitif buyukluk; deklarani -deger alir).
const UNDERTRICK_SCORES = {
  "-1": {
    "nonVul": {
      "normal": 50,
      "doubled": 100,
      "redoubled": 200
    },
    "vul": {
      "normal": 100,
      "doubled": 200,
      "redoubled": 400
    }
  },
  "-2": {
    "nonVul": {
      "normal": 100,
      "doubled": 300,
      "redoubled": 600
    },
    "vul": {
      "normal": 200,
      "doubled": 500,
      "redoubled": 1000
    }
  },
  "-3": {
    "nonVul": {
      "normal": 150,
      "doubled": 500,
      "redoubled": 1000
    },
    "vul": {
      "normal": 300,
      "doubled": 800,
      "redoubled": 1600
    }
  },
  "-4": {
    "nonVul": {
      "normal": 200,
      "doubled": 800,
      "redoubled": 1600
    },
    "vul": {
      "normal": 400,
      "doubled": 1100,
      "redoubled": 2200
    }
  },
  "-5": {
    "nonVul": {
      "normal": 250,
      "doubled": 1100,
      "redoubled": 2200
    },
    "vul": {
      "normal": 500,
      "doubled": 1400,
      "redoubled": 2800
    }
  },
  "-6": {
    "nonVul": {
      "normal": 300,
      "doubled": 1400,
      "redoubled": 2800
    },
    "vul": {
      "normal": 600,
      "doubled": 1700,
      "redoubled": 3400
    }
  },
  "-7": {
    "nonVul": {
      "normal": 350,
      "doubled": 1700,
      "redoubled": 3400
    },
    "vul": {
      "normal": 700,
      "doubled": 2000,
      "redoubled": 4000
    }
  },
  "-8": {
    "nonVul": {
      "normal": 400,
      "doubled": 2000,
      "redoubled": 4000
    },
    "vul": {
      "normal": 800,
      "doubled": 2300,
      "redoubled": 4600
    }
  },
  "-9": {
    "nonVul": {
      "normal": 450,
      "doubled": 2300,
      "redoubled": 4600
    },
    "vul": {
      "normal": 900,
      "doubled": 2600,
      "redoubled": 5200
    }
  },
  "-10": {
    "nonVul": {
      "normal": 500,
      "doubled": 2600,
      "redoubled": 5200
    },
    "vul": {
      "normal": 1000,
      "doubled": 2900,
      "redoubled": 5800
    }
  },
  "-11": {
    "nonVul": {
      "normal": 550,
      "doubled": 2900,
      "redoubled": 5800
    },
    "vul": {
      "normal": 1100,
      "doubled": 3200,
      "redoubled": 6400
    }
  },
  "-12": {
    "nonVul": {
      "normal": 600,
      "doubled": 3200,
      "redoubled": 6400
    },
    "vul": {
      "normal": 1200,
      "doubled": 3500,
      "redoubled": 7000
    }
  },
  "-13": {
    "nonVul": {
      "normal": 650,
      "doubled": 3500,
      "redoubled": 7000
    },
    "vul": {
      "normal": 1300,
      "doubled": 3800,
      "redoubled": 7600
    }
  }
};

// IMP olcegi (to === null => ust sinir yok)
const IMP_SCALE = [
  {
    "from": 0,
    "to": 10,
    "imp": 0
  },
  {
    "from": 20,
    "to": 40,
    "imp": 1
  },
  {
    "from": 50,
    "to": 80,
    "imp": 2
  },
  {
    "from": 90,
    "to": 120,
    "imp": 3
  },
  {
    "from": 130,
    "to": 160,
    "imp": 4
  },
  {
    "from": 170,
    "to": 210,
    "imp": 5
  },
  {
    "from": 220,
    "to": 260,
    "imp": 6
  },
  {
    "from": 270,
    "to": 310,
    "imp": 7
  },
  {
    "from": 320,
    "to": 360,
    "imp": 8
  },
  {
    "from": 370,
    "to": 420,
    "imp": 9
  },
  {
    "from": 430,
    "to": 490,
    "imp": 10
  },
  {
    "from": 500,
    "to": 590,
    "imp": 11
  },
  {
    "from": 600,
    "to": 740,
    "imp": 12
  },
  {
    "from": 750,
    "to": 890,
    "imp": 13
  },
  {
    "from": 900,
    "to": 1090,
    "imp": 14
  },
  {
    "from": 1100,
    "to": 1290,
    "imp": 15
  },
  {
    "from": 1300,
    "to": 1490,
    "imp": 16
  },
  {
    "from": 1500,
    "to": 1740,
    "imp": 17
  },
  {
    "from": 1750,
    "to": 1990,
    "imp": 18
  },
  {
    "from": 2000,
    "to": 2240,
    "imp": 19
  },
  {
    "from": 2250,
    "to": 2490,
    "imp": 20
  },
  {
    "from": 2500,
    "to": 2990,
    "imp": 21
  },
  {
    "from": 3000,
    "to": 3490,
    "imp": 22
  },
  {
    "from": 3500,
    "to": 3990,
    "imp": 23
  },
  {
    "from": 4000,
    "to": null,
    "imp": 24
  }
];

if (typeof module !== "undefined") { module.exports = { CONTRACT_SCORES, UNDERTRICK_SCORES, IMP_SCALE }; }
