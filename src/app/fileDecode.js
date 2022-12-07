const decodeData = async (files) => {
    return new Promise(async (resolve, reject) => {
        try {
            let json = "";

            if (files.startsWith("PK")) {
                console.log("🗂 ZIP file detected");
                json = files.slice(
                    files.indexOf("{"),
                    files.length
                );

                json = json.slice(0, json.lastIndexOf("/user_data.json"));
                json = json.slice(0, json.lastIndexOf("}") + 1);

                resolve(JSON.parse(json));
            } else {
                console.log("📝 JSON file detected");
                resolve(JSON.parse(files));
            }
        }
        catch (error) {
            reject(error);
        }
    })
}

export { decodeData }