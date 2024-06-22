class ApiFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;

    }

    search(){
        const keyword=this.queryStr.keyword?
        {
            $or: [
                { name: { $regex: this.queryStr.keyword, $options: "i" } },
                { brand: { $regex: this.queryStr.keyword, $options: "i" } }
            ]
        }:{};

        
        this.query=this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy={...this.queryStr};

        //remove some not required keywords
        const fieldsToBeRemoved=["keyword","page","limit","requiredCount"];
        fieldsToBeRemoved.forEach(key=>delete queryCopy[key]);
        
        //filtering for price
        let queryString=JSON.stringify(queryCopy);
        queryString = queryString.replace(/\b(gt|lt|gte|lte)\b/g, (key) => `$${key}`);

        
        this.query=this.query.find(JSON.parse(queryString));
        return this;
    }

    pagination(resultsPerPage){
        const currentpage=Number(this.queryStr.page) || 1;

        const skip=(currentpage-1)*resultsPerPage;

        this.query=this.query.limit(resultsPerPage).skip(skip);
        return this;
    }
}

module.exports=ApiFeatures;