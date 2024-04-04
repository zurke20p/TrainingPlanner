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
    getExcersises: async (search) =>
    {
        const excersise = await excersiseModel.find(search);

        return excersise;
    },
    validate: (type, equipment, visibility, videoTimeStamp) =>
    {
        const types = ["strength", "cardio", "stretching", "balance", "interval", "functional", "plyometric", "mobility"];
        const equipments = ["dumbbells", "machine", "kettlebells", "cables", "plate", "smith", "barbell", "bodyweight", "medBall", "stretches", "trx", "bosuBall"];
        const visibilities = ["public", "private", "protected"];

        let timeStamp = true;

        if(videoTimeStamp != "")
            timeStamp = (new RegExp("^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$")).test(videoTimeStamp);

        return types.some(el => el == type) && equipments.some(el => equipment.some(eq => eq == el)) && visibilities.some(el => el == visibility) && timeStamp;
    },
    createExcersise: (id, title, desc, type, equipment, visibility, videoTimeStamp, videoLink) =>
    {
        let timeStamp = 0;
        let videoType = "none";

        if(videoLink.includes("https://www.youtube.com/watch?v="))
        {
            videoType = "yt";
            const replacer = videoLink.substring(videoLink.indexOf("&t="), videoLink.length);
            videoLink = `https://www.youtube.com/embed/${videoLink.replace("https://www.youtube.com/watch?v=", "").replace(replacer, "")}`;
        }
        else if(videoLink != "")
            videoType = "link";

        if(videoTimeStamp != "")
        {
            const splitted = videoTimeStamp.split(':');
            timeStamp = splitted[0] * 3600 + splitted[1] * 60 + splitted[2];
        }

        const excersise = {
            excersiseID: id,
            title: title,
            desc: desc,
            type: type,
            equipment: equipment,
            visibility: visibility,
            videoType: videoType,
            videoTimeStamp: timeStamp,
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
