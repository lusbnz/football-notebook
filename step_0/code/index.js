const fs = require('fs');
const axios = require('axios');
const matchFileJson = require('../matches/match_2024.json');

const matchV2Json = matchFileJson.matches.map((item) => item.id);

const tokens = ['033a7c44a7a443099f71f2d32a978764', '88a2f06b4cbb4eb9bcfbae9fd996656d'];

let i = 0;

const fetchHeadToHeadData = async () => {
    for (const [index, match] of matchFileJson.matches.entries()) {
        const url = `http://api.football-data.org/v4/matches/${match.id}/head2head`;
        let rqFaild = true;
        while (rqFaild) {
            try {
                const req = await axios.get(url, {
                    headers: {
                        "X-Auth-Token": tokens[i % 2],
                    },
                });
                const data = req.data;
                rqFaild = false;
                matchFileJson.matches[index].head2head = data;
            } catch (err) {
                if (err?.response?.status == 429) {
                    console.log({
                        e: err?.response?.status,
                        token: tokens[i % 2],
                        message: err.response.data.message,
                        index: index,
                        i
                    });
                    i++;
                }
                else {
                    console.log(err)
                }

            }
        }
    }

    fs.writeFile('match_and_h2h.json', JSON.stringify(matchFileJson), (err) => {
        if (!err) {
            console.log('done');
        } else {
            console.error('Error writing file:', err);
        }
    });
};

fetchHeadToHeadData();
