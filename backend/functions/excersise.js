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
    validate: (type, equipment, visibility, videoTimeStamp) =>
    {
        const types = ["strength", "cardio", "stretching", "balance", "interval", "functional", "plyometric", "mobility"];
        const equipments = ["dumbbells", "machine", "kettlebells", "cables", "plate", "smith", "barbell", "bodyweight", "medBall", "stretches", "trx", "bosuBall"];
        const visibilities = ["public", "private", "protected"];

        return types.some(el => el == type) && equipments.some(el => equipment.some(eq => eq == el)) && visibilities.some(el => el == visibility) && ((new RegExp("^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$")).test(videoTimeStamp));
    },
    createExcersise: (id, title, desc, type, equipment, visibility, videoTimeStamp, videoLink) =>
    {
        videoTimeStamp = videoTimeStamp.split(':');
        videoTimeStamp = videoTimeStamp[0] * 3600 + videoTimeStamp[1] * 60 + videoTimeStamp[2];
        const excersise = {
            excersiseID: id,
            title: title,
            desc: desc,
            type: type,
            equipment: equipment,
            visibility: visibility,
            videoTimeStamp: videoTimeStamp,
            videoLink: videoLink,
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
