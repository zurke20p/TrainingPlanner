const excersiseModel = require('../mongoSchemas/excersiseSchema');

module.exports = {
    exists: async (search) =>
    {
        const excersise = await excersiseModel.findOne(search);

        return excersise != undefined;
    },
    getExcersise: async (search) =>
    {
        const excersise = await excersiseModel.findOne(search);

        return excersise;
    },
    validate: (type, equipment, visibility) =>
    {
        const types = ["strength", "cardio", "stretching", "balance", "interval", "functional", "plyometric", "mobility"];
        const equipments = ["dumbbells", "machine", "kettlebells", "cables", "plate", "smith", "barbell", "bodyweight", "medBall", "stretches", "trx", "bosuBall"];
        const visibilities = ["public", "private", "protected"];

        return types.some(el => el == type) && equipments.some(el => equipment.some(eq => eq == el)) && visibilities.some(el => el == visibility);
    },
    createExcersise: (id, title, desc, type, equipment, visibility) =>
    {
        const excersise = {
            excersiseID: id,
            title: title,
            desc: desc,
            type: type,
            equipment: equipment,
            visibility: visibility,
        };

        return excersise;
    },
    changeData: async (filter, data) =>
    {
        await excersiseModel.findOneAndUpdate(
            filter, 
            { $set: data });
    },
}
