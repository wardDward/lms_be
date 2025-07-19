
export const normalizeMongoDoc = (doc: any): any => {
    // if doc is array apply same normalization recurssively
    if (Array.isArray(doc)) {
        return doc.map(normalizeMongoDoc);
    }
    // if doc is object  
    if (doc && typeof doc === "object") {
        // create new empty object
        const newDoc: any = {};
        // loop over the values
        for (const key in doc) {
            const value = doc[key];
            if (value && typeof value === "object") {
                // if value is $oid take its value
                if ("$oid" in value) {
                    newDoc[key] = value["$oid"];
                    // if value is $date convert it to new Date
                } else if ("$date" in value) {
                    newDoc[key] = new Date(value["$date"]);
                } else {
                    newDoc[key] = normalizeMongoDoc(value); // Recursive for nested objects
                }
            } else {
                // if not then directly copy the value and the key
                newDoc[key] = value;
            }
        }

        return newDoc;
    }

    return doc;
}

