class DataBaseViewer{

    initialize(values){}

    translateDbEntryIntoHTML(dbEntry){}
	
	postProcessNode(node){}
	
}


class EventsViewer extends DataBaseViewer{

    initialize(values){
		this.ERROR_MESSAGE = "ERROR! Something went wrong during the generation of the node";
		this.d = values[0];
		this.today = new Date();
	}
	
	castToDate(ddmmyy){
        ddmmyy = ddmmyy.split("/"); 
		return new Date(ddmmyy[2],ddmmyy[1]-1,ddmmyy[0],23,59);	//yymmdd
	}

    translateDbEntryIntoHTML(dbEntry){
	    let html = this.ERROR_MESSAGE;
		try{
			let browsables = [];
			let imageDirs  = dbEntry.imageDirs;
			for(let i=0;i<imageDirs.length;i++)
				browsables.push(`<img class="fluid-element" src="${imageDirs[i]}"></img>`);
			
			let button = "";
			if(this.today <= this.castToDate(dbEntry.bookingDateLimit)){
			    button = `<button class="common-container common-button"></button>`;
			    this.lastDbEntry = dbEntry;
			}
			
			let dateRange;
			
			if(dbEntry.dateFrom == dbEntry.dateTo)
				dateRange = `${dbEntry.dateFrom}`;
			else	
			    dateRange = `${this.d.from} ${dbEntry.dateFrom} ${this.d.to} ${dbEntry.dateTo}`;
			
			html = `
				<div class="common-overlaid-container expandable-container add-med-spacing spawn-element">
					<div class="expandable-container-title row align-items-center">
						 <div class="col-md-6">
							 <h2>${dbEntry.title}</h2>
							 <h3>${dbEntry.lessonCycle}: ${dbEntry.timeFrom} - ${dbEntry.timeTo}</h3>
							 <i>${dateRange}, ${dbEntry.bookingOption}.</i>
						 </div>
						 <div class="col-md-6 browsable-container">
							<div class="browsables add-min-vert-spacing">${browsables.join("")}</div>
						 </div>
					</div>
					<div class="expandable-container-content"><text>
						${dbEntry.description}
						 <p class="add-min-spacing"><i>${this.d.bookingLimit} ${dbEntry.bookingDateLimit}, ${this.d.costType}: ${dbEntry.cost}${this.d.currency}</i></p> 
					</text></div>
					${button}
					</div>
			`;
		}catch(typeError){console.log(typeError)}
		
	    return html;
	}
	
	postProcessNode(node){
		let btn = node.querySelector("button");
		if(!btn) return;
		
		let dbEntry = this.lastDbEntry;
		
		let txt,func;
		if(this.lastDbEntry.cost == 0){
			func = () => {this.showInfo(dbEntry.eventInfo)};
			txt  = this.d.eventInfo;
		}
		else{
			func = () => {this.showPaymentInfo()};
			txt  = this.d.reserveSpot;
		}
		
		btn.addEventListener("click",func);
		btn.innerHTML = txt;
	}
	
	showInfo(info){			
		let window2  = window.open("free-event-landing-page.html");
		let interval = setInterval(()=>{
			try{
				let element = window2.document.getElementById("async_data_transmission");  //this works ONLY if using http://, not file:// !!
				if(element)
					element.innerHTML = info;
				else
					clearInterval(interval);
			}catch(typeError){}
		}, 1000);		
	}
	
	showPaymentInfo(){
		window.open("payment-info.html");		
	}
}