
export const normalizeMongoDoc = (doc: any): any => {
    if (Array.isArray(doc)) {
        return doc.map(normalizeMongoDoc);
    }

    if (doc && typeof doc === "object") {
        const newDoc: any = {};

        for (const key in doc) {
            const value = doc[key];

            if (value && typeof value === "object") {
                if ("$oid" in value) {
                    newDoc[key] = value["$oid"];
                } else if ("$date" in value) {
                    newDoc[key] = new Date(value["$date"]);
                } else {
                    newDoc[key] = normalizeMongoDoc(value); // Recursive for nested objects
                }
            } else {
                newDoc[key] = value;
            }
        }

        return newDoc;
    }

    return doc;
}

