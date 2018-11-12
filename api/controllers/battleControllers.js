const battleModel = require('../models/battleModels')

const listBattle = (req, res) => {

    battleModel.find({}, { location: 1, _id: 0 }, (err, data) => {
        if (!err) return res.status(200).send(data.map(item => item.location).filter(itm=>itm));
        else return res.status(400).send("Something went wrong, try again!");
    })

}

const countBattle = (req, res) => {

    battleModel.find({}, (err, data) => {
        if (!err) return res.status(200).send({ battleCount: data.length });
        else return res.status(400).send("Something went wrong, try again!");
    })

}

const searchBattle = (req, res) => {

    let king = req.query.king,
        location = req.query.location,
        type = req.query.type;

    let query = king ? {
        $and: [{
            $or: [
                { "attacker_king": "Robb Stark" },
                { "defender_king": "Robb Stark" }
            ]
        }]
    } : {};

    if (location) query['$and'].push({ "location": location })
    if (type) query['$and'].push({ "battle_type": type })

    battleModel.find(query, (err, data) => {
        if (!err) {
            data = data.length > 0 ? data : 'No record found'
            return res.status(200).send(data)
        } else {
            return res.status(400).send('Query incorrect')
        }
    })

}

const statsBattle = (req, res) => {

    let finalList = ["attacker_king", "defender_king", "region", "name"];
    let attacker_outcome = ["win", "loss"];
    let battleType = [];
    let count = 0;
    let name_obj = {};
    let obj = {};

    let p1 = new Promise((resolve, reject) => {
        battleModel.aggregate([{
                $group: {
                    _id: "$null",
                    average: { $avg: "$defender_size" },
                    min: { $min: "$defender_size" },
                    max: { $max: "$defender_size" },
                    battle_type: { $addToSet: "$battle_type" },
                    myCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    defender_size: { average: "$average", max: "$max", min: "$min" },
                    battle_type: "$battle_type"
                }
            }

        ], (err, data) => {
            if (data) {
                data[0]['_id'] = undefined
                return resolve(data[0])
            } else {
                return reject({ msg: "Something went wrong!" })
            }
        })
    })

    let p2 = new Promise((resolve, reject) => {
        finalList.forEach((item, index) => {
            battleModel.aggregate([{
                    $group: {
                        _id: "$" + item,
                        myCount: { $sum: 1 }
                    }
                },

                { $sort: { "myCount": -1 } },
                { $limit: 1 },
                {
                    $project: {
                        [item]: "$_id",
                        _id: undefined
                    }
                }

            ], (err, docs) => {
                if (docs) {
                    obj = Object.assign(obj, docs[0])
                    if (Object.keys(obj).length - 1 == finalList.length) {
                        obj._id = undefined
                        return resolve(obj)
                    }

                } else {
                    return reject({ msg: "Something went wrong!" })
                }
            })

        })
    })

    let p3 = new Promise((resolve, reject) => {
        let attackerOutcome = {};
        let intAttOut = 0;
        attacker_outcome.forEach((item, index) => {

            battleModel.aggregate([{
                    $match: {
                        attacker_outcome: {
                            $eq: item
                        }
                    }
                },
                {
                    $count: item
                }
            ], (err, docs) => {
                if (!err) {
                    intAttOut++;
                    attackerOutcome = Object.assign(attackerOutcome, docs[0])
                    if (intAttOut === attacker_outcome.length) {
                        attackerOutcome._id = undefined
                        return resolve(attackerOutcome)
                    }
                } else {
                    return reject({ msg: "Something went wrong!" })
                }
            })
        })
    })

    Promise.all([p1, p2, p3]).then((data) => {

        data[0].battle_type = data[0].battle_type.filter((obj) => obj);

        let finalRes = Object.assign({
            most_active: data[1],
            attacker_outcome: data[2]
        }, data[0])

        return res.send(finalRes);

    }).catch((reason) => {
         return res.status(400).send("Something went wrong, try again!");
    })

}

module.exports = {
    listBattle,
    countBattle,
    searchBattle,
    statsBattle
}