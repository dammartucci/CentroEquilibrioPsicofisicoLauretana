/*  
    Custom design & development 
    COPYRIGHT ® 2025 Damiano Martucci, AFSI SRLs. All rights reserved.
	AUTHOR: Damiano Martucci <damiano.martucci.business@gmail.com>
    
	This code is proprietary and confidential. Unauthorized copying 
	of this file, via any medium, is strictly prohibited. 
*/

class DataBaseViewer{
    /*public void*/ initialize(valuesObjArr){}

    /*public String*/ translateDbEntryIntoHTML(dbEntryObj){}
	
	/*public void*/ postProcessNode(node){}
	
	//ADD HERE all methods that are needed by children classes
	/*public static Date*/ castToDate(ddmmyyStr){                          //takes as input a date in format dd/mm/yy
        let ddmmyyNumArr = ddmmyyStr.split("/");        
		return new Date(ddmmyyNumArr[2],ddmmyyNumArr[1]-1,ddmmyyNumArr[0],23,59);	//yymmdd
	}
}


class EventsViewer extends DataBaseViewer{

    /*public void*/ initialize(valuesObjArr){
		this.ERROR_MESSAGEStr = "ERROR! Something went wrong during the generation of the Node instance";
		this.localeStringsObj = valuesObjArr[0];
		this.todayDate = new Date();
	}

    /*public String*/ translateDbEntryIntoHTML(dbEntryObj){
	    let htmlStr = this.ERROR_MESSAGEStr;
		try{
			let browsablesNodeStrArr = SharedResourcesFactory.getBrowsablesNodeInnerHTML(dbEntryObj.imageDirs);
			
			let dateRangeStr = `${this.localeStringsObj.from} ${dbEntryObj.dateFrom} ${this.localeStringsObj.to} ${dbEntryObj.dateTo}`;
			if(dbEntryObj.dateFrom == dbEntryObj.dateTo) dateRangeStr = `${dbEntryObj.dateFrom}`;
			
			let buttonStr = "";
			if(this.todayDate <= super.castToDate(dbEntryObj.bookingDateLimit)){  //check if the event is still available
			    buttonStr = `<button class="common-container common-button"></button>`;
			    this.lastDbEntry = dbEntryObj;
			}
			
			htmlStr = `
				<div class="common-overlaid-container expandable-container add-med-spacing spawn-element">
					<div class="expandable-container-title row align-items-center">
						 <div class="col-md-6">
							 <h2>${dbEntryObj.title}</h2>
							 <h3>${dbEntryObj.lessonCycle}: ${dbEntryObj.timeFrom} - ${dbEntryObj.timeTo}</h3>
							 <i>${dbEntryObj.lessonMode}, ${dateRangeStr}, ${dbEntryObj.bookingOption}.</i>
						 </div>
						 <div class="col-md-6 browsable-container">
							<div class="browsables add-min-vert-spacing">${browsablesNodeStrArr.join("")}</div>
						 </div>
					</div>
					<div class="expandable-container-content"><text>
						${dbEntryObj.description}
						 <p class="add-min-spacing"><i>${this.localeStringsObj.bookingLimit} ${dbEntryObj.bookingDateLimit}, ${this.localeStringsObj.costType}: ${dbEntryObj.cost}${this.localeStringsObj.currency}</i></p> 
					</text></div>
					${buttonStr}
					</div>
			`;
		}catch(typeError){console.log(typeError)}
		
	    return htmlStr;
	}
	
	/*public void*/ postProcessNode(node){
		let btnNode = node.querySelector("button");
		if(!btnNode) return;
		
		let dbEntryObj = this.lastDbEntry;
		let functio;
		let txtStr;	
		if(dbEntryObj.cost == 0){
			functio = () => {this.showInfo(dbEntryObj.eventInfo)};
			txtStr  = this.localeStringsObj.eventInfo;
		}
		else{
			functio = () => {this.showPaymentInfo(dbEntryObj.title)};
			txtStr  = this.localeStringsObj.reserveSpot;
		}
		
		btnNode.addEventListener("click",functio);
		btnNode.innerHTML = txtStr;
	}
	
	showInfo(infoStr)       {this.sendAsyncData("free-event-landing-page.html","event-info",infoStr);}
	showPaymentInfo(infoStr){this.sendAsyncData("payment-info.html","event-name",infoStr);}
	
	sendAsyncData(htmlPathStr, transmissionNodeIdStr, infoStr){
		let currWindow    = window.open(htmlPathStr);
		let intervalIdNum = setInterval(()=>{
			try{
				let currNode = currWindow.document.getElementById(transmissionNodeIdStr);  //this works correctly in http, but in local testing only if CORS policies are turned off
				if(currNode)   currNode.innerHTML = infoStr;
				else           clearInterval(intervalIdNum);
			}catch(typeError){}
		}, 1000);			
	}
}


class EventsViewerSimplified extends DataBaseViewer{
	
	/*public void*/ initialize(valuesObjArr){
		this.ERROR_MESSAGEStr = "ERROR! Something went wrong during the generation of the node";
		this.localeStringsObj = valuesObjArr[0];
		this.todayDate = new Date();
	}
	
    /*public String*/ translateDbEntryIntoHTML(dbEntryObj){
		let htmlStr = this.ERROR_MESSAGEStr;
		
		try{
			let browsablesNodeStrArr = SharedResourcesFactory.getBrowsablesNodeInnerHTML(dbEntryObj.imageDirs);
			//let formButtonStr = `<button class="button-to-require-form common-container common-button">Clicca per caricare il form</button>`;
					
			let eventPartMode = SharedResourcesFactory.getEventOngoingState((this.todayDate <= super.castToDate(dbEntryObj.bookingDateLimit)));  //check if the event is still available
			let paymentInfo   = SharedResourcesFactory.getPaymentInfo(dbEntryObj.cost,dbEntryObj.title); 
			
			 htmlStr = `
			     <div>
					 <h1 class="spawn-element">${dbEntryObj.title}</h1>					
					 <div class="row">
						<div class="col-sm-5 browsable-container spawn-element">
							<div class="browsables common-overlaid-container add-min-vert-spacing">${browsablesNodeStrArr.join("")}</div>
						</div>
					    <div class="col-sm-7 spawn-element" style="text-align:left">
						    <strong class="info-box">
						        Tipo: ${dbEntryObj.lessonCycle} ${dbEntryObj.lessonMode}<br>
								Orario: ${dbEntryObj.timeFrom}-${dbEntryObj.timeTo}<br>
								Data: dal ${dbEntryObj.dateFrom} al ${dbEntryObj.dateTo}<br>
							</strong><br>
							${dbEntryObj.description}
						</div>
					 </div>	 
                     <div>${eventPartMode}</div>
					 <div>${paymentInfo}</div>
                 </div>					 
			`;		
		}
		catch(typeError){console.log(typeError)}
        
		return htmlStr;	
	}
	
	/*public void*/ postProcessNode(node){
		/*let buttonNode = node.querySelector(".button-to-require-form");
		buttonNode.addEventListener("click",() => buttonNode.parentElement.classList.add("requires-form"));	*/	
	}	
}