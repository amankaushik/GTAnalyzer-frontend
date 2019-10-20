export const csvFileParserMixin = {
   methods: {
       parseCSVFile: function (file) {
           let fileContentList = file.split("\n");  // convert content sting to lines/list
           let fileContentListRem = fileContentList.slice(1);  // remove header
           let contentMap = new Map();
           // Assumption 1: file has exactly 4 columns
           // Assumption 2: Second column is 'github-id' and last column is 'repo-name'
           for (let line of fileContentListRem) {
               line = line.split(",");  // convert content sting to lines/list
               let key = line[3];
               let value = line[1];
               if (contentMap.has(key)) {  // repo-name exits in map
                   contentMap.set(key, contentMap.get(key).concat(value));
               } else {
                   contentMap.set(key, [value]);
               }
           }
           //  flatten map to a list of repo-name followed by user-names
           let contentList = Array.from(contentMap).map(entry => [entry[0]].concat(entry[1]));
           let sanitizedContentList = []
           for (let line of contentList) {
               sanitizedContentList.push(line.map(item => item.trim(" ")))
           }
           return sanitizedContentList;
       }
   }
}
