//node first.js --dest2=Excel.xlsx --url="https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results"
//npm install minimist
//npm install jsdom
//npm install axios
//npm install excel4node
//npm install pdf-lib
let minimist=require("minimist");
let jsdom=require("jsdom");
let axios=require("axios");
let excel=require("excel4node");
let pdf=require("pdf-lib");
let arg=minimist(process.argv);
//console.log(arg.url);
let downloadkapromise=axios.get(arg.url);
downloadkapromise.then(function (response) {
    let html=response.data;
    //console.log(html);
    let dom=new jsdom.JSDOM(html);
    let mydocument=dom.window.document;
    let matchdetails=mydocument.querySelectorAll("div.match-info-FIXTURES");
    let n=matchdetails.length;
    let allteamdata=[];
    let myallteamdata=[];
    for(let i=0;i<n;i++){
        let result=matchdetails[i].querySelector("div.status-text").textContent;//result
        let tnames=matchdetails[i].querySelectorAll("p.name");//names of team
        //console.log(tnames[0].textContent+".... vs ..."+tnames[1].textContent+" = "+result);
        let tscore=matchdetails[i].querySelectorAll("span.score");//team scores
        let teamobj={//created to store each object value
            t1:"",//team1 name
            t2:"",//team2 name
            t1s:"",//team1 score
            t2s:"",//team2 score
            res:""//result

        }
        teamobj.t1=tnames[0].textContent;
        teamobj.t2=tnames[1].textContent;
        teamobj.res=result;
        if(tscore.length==2){
            teamobj.t1s=tscore[0].textContent;
            teamobj.t2s=tscore[1].textContent;
        }else if(tscore.length==1){
            teamobj.t1s=tscore[0].textContent;
        }
        allteamdata.push(teamobj);
        nhiptaname(myallteamdata,tnames);
        jholabharo(myallteamdata,teamobj);
    }
    let s=0;
  /* for(let i=0;i<myallteamdata.length;i++){
      s+=myallteamdata[i].vs.length;} */
      makexcel(myallteamdata );
    
})
function nhiptaname(myallteamdata,teams) {
    let idx=-1;
    let obj;
    for(let i=0;i<myallteamdata.length;i++){
        if(teams[0].textContent==myallteamdata[i].name)
        idx=1;
    }
    if(idx==-1){
        obj={
            name:teams[0].textContent,
            vs:[]
        }
        myallteamdata.push(obj);
    }
    let idx1=-1;
    let obj1;
    for(let i=0;i<myallteamdata.length;i++){
        if(teams[1].textContent==myallteamdata[i].name)
        idx1=1;
    }
    if(idx1==-1){
        obj1={
            name:teams[1].textContent,
            vs:[]
        }
        myallteamdata.push(obj1);
    }
}
function jholabharo(myallteamdata,tobj) {
    let idx=-1;
    for(let i=0;i<myallteamdata.length;i++){
        if(tobj.t1==myallteamdata[i].name)
            idx=i;
    }
    if(idx!=-1){
        myallteamdata[idx].vs.push({
            opponent:tobj.t2,
            myrun:tobj.t1s,
            opponentrun:tobj.t2s,
            result:tobj.res
        })
    }
    let idx1=-1;
    for(let i=0;i<myallteamdata.length;i++){
        if(tobj.t2==myallteamdata[i].name)
            idx1=i;
    }
    if(idx1!=-1){
        myallteamdata[idx1].vs.push({
            opponent:tobj.t1,
            myrun:tobj.t2s,
            opponentrun:tobj.t1s,
            result:tobj.res
        })
    }
    
}
function makexcel(myallteamdata ) {
    let wb = new excel.Workbook();
for(let i=0;i<myallteamdata.length;i++){
    let ws = wb.addWorksheet(myallteamdata[i].name);
    //console.log("Rank "+data[i].Rank);
    ws.cell(1, 1).string('VS');
    ws.cell(1, 2).string("TEAM_RUN");
    ws.cell(1, 3).string('OPPONENTRUN');
    ws.cell(1, 5).string('RESULTS');
    for(let j=0;j<myallteamdata[i].vs.length;j++){
    ws.cell(2+j, 1).string(myallteamdata[i].vs[j].opponent);
    ws.cell(2+j, 2).string(myallteamdata[i].vs[j].myrun);
    ws.cell(2+j, 3).string(myallteamdata[i].vs[j].opponentrun);
    ws.cell(2+j, 5).string(myallteamdata[i].vs[j].result);
    } 
    //console.log("\n............................................\n");
}
wb.write(arg.dest2);
}