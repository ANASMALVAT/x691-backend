const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

exports.GroupControl = async (req, res, next) => {
    let { group_id, token, rootURL } = req.body;

    try {
        if (!group_id || !token || !rootURL) {
            throw new Error("Invalid input data");
        }

        if (rootURL.charAt(rootURL.length - 1) !== '/') {
            rootURL += '/';
        }

        rootURL += "api/v4/";

        const request = {
            method: "GET",
            url: `${rootURL}groups/${group_id}/projects`,
            headers: {
                "PRIVATE-TOKEN": token,
            },
        };

        console.log("Fetching Group Projects.....");
        let groupProjectInformation = [];
        const groupProjects = await axios.request(request);
        for(let i = 0 ; i < groupProjects.data.length; i ++)
            {
                let groupInfo = groupProjects.data[i];
                groupProjectInformation.push({"project_id" : groupInfo.id, "name" : groupInfo.name,"web_url" : groupInfo.web_url});
        }
        console.log(" Group Projects Fetched!");
        req.userdata = groupProjectInformation;
        next();

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

