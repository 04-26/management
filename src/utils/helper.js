class Utils {
    /**
     * 树形结构数组
     * @param {要进行树形结构的列表或者数组} list 
     * @param {父级的值} pid 
     * @param {按照这个字段进行树形结构} field 
     */
    tree(list,pid,field){
        let nlist = [];
        if(list && field && list.length>0){
            list.forEach((item,index)=>{
                if(item[field]==pid){
                    item.children = this.tree(list,item.id,field);
                    nlist.push(item);
                }
            });
           
        }
        return nlist;
    }
    /**
     * 树形结构数组，不含children
     * @param {要进行树形的列表或者数组} list 
     * @param {父级的值} pid 
     * @param {是通过那个字段进行树形结构} field 
     * @param {树形节点等级} level 
     * @param {连接符} prev 
     */
    treeList(list,pid,field,level=1,prev='-'){
        let nlist = [];
        if(list && field && list.length>0){
            list.forEach((item,index)=>{
                item.level = level;
                // item.name = '|--'+item.name; 
                if(item[field]==pid){
                    if(item.level==1){
                        item.name = '|--' + item.name;
                    }else{
                        item.name = '|--' + prev.repeat(item.level)+item.name;
                    }
                    this.treeList(list,item.id,field,item.level+1,prev);
                }
                nlist.push(item);
            });
        }
        return nlist;
    }
    /**
     * 对分类类型数组进行排序
     * @param {要进行排序的列表或者数组} list 
     * @param {是通过那个字段进行排序} field 
     */
    sort(list,field){
        if(list && list.length>0){
            let len = list.length;
            for(let i=0;i<list.length;i++){
                if(len==i){
                    break ;
                }
                if(list[i+1] && list[i][field]<list[i+1][field]){
                    let temp = list[i];
                    list[i] = list[i+1];
                    list[i+1] = temp;
                }else{
                    continue;
                }
                this.sort(list,field);
            }
            return list;
        } 
    }
    /**
     * 扩展字符串截取，美化截取后字符串
     * @param {要截取的字符串} ctn 
     * @param {截取字符串开始位置} start 
     * @param {截取的结束位置} end 
     * @param {截取后的字符显示更多} append 
     */
    substr(ctn,start=0,end,append='...'){
        if(ctn && (typeof ctn =='string')){
            end = end ? end:ctn.length;
            start = typeof start=='number' ? start : 0;
            if(ctn.length==end){
                return ctn;
            }
            let nctn = ctn.substr(start,end);
            return nctn+append;
        }
    }
}

export default new Utils();