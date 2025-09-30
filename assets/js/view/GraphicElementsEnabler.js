//here the scripts to manipulate the DOM graphic elements. Shared so that it's loaded one time, for every page
//someone may wonder why to do this, while i could actually create a script type="module". I tried, and I was 
//blocked by the browser's CORS policy, that i was not able to disable for offline testing. I could run a local
//server, but i refused to do that. After undoing all the changes, like the export classes of the model, finally 
//i came up with this class. 
//i added the dynamic generation of main menu and footer note for the same reason i created the other functions:
//avoiding to manually update every item in case i change something. This js injection is more than justified to me.
//the beginning and the end of each page is constant. No reason to repeat.

class GraphicElementsEnabler{
	
	constructor(){
		document.addEventListener("DOMContentLoaded",() => {
			this.createMainMenu();
			this.enableMainMenuButtons();
			this.enableMainMenuJollyButton();                           //available on all documents
			this.createFooterNote();
			
			this.expandableContainerEnableExpandCollapse();             //available in mostly all documents
			this.expandableContainerEnablePreviewGenerateText();
			this.enableElementsSpawning();
			
			this.switchAvailableLocations();                            //available only in some documents, using specific ids
			this.createForm();
			this.enableParallaxEffect();
			this.enableReserveSpotButton();
		});
	}
	
	
	//FUNCTIONS TO HANDLE MAIN MENU NAVIGATION
	
    //0. create the main menu, for easy update and use on all webpages	 
	createMainMenu(){

	    let mainMenu = document.createElement('div');
		mainMenu.id  = "main-menu";
	    mainMenu.className = "common-overlaid-container common-menu spawn-element";   //className overwrites the classList array
		mainMenu.innerHTML = `
			<div class="block-container">
				<img class="logo" src="assets/images/logo.png">
				<button id="main-button" class="menu-main-button">Centro Equilibrio Psicofisico di Lauretana</button>
			</div>
			<div id="menu-items">
				<button id="events-button"     class="common-container common-menu-button">Eventi</button>
				<button id="about-us-button"   class="common-container common-menu-button">Chi siamo</button>
				<button id="contact-us-button" class="common-container common-menu-button">Contatti</button>
				<button id="history-button"    class="common-container common-menu-button">Storia</button>
				<!--<button class="common-container common-button">Eventi</button>-->
			</div>		
		    <!-- the element used to collect overflowing items from the menu -->
		    <div id="overflow-container" class="common-overlaid-container common-menu overflow-list" hidden="true"></div>
		    <!-- the button, always appended at the end -->
			<button id="jolly-button" class="common-container common-button put-on-right-side"></button>
		`;
		
		document.body.prepend(mainMenu);		
	}
	 
	//1. associate buttons to their correspondant functions
	enableMainMenuButtons(){
		document.getElementById("main-button").addEventListener('click',() =>
			{window.location.href="main.html"}
		);

		document.getElementById("about-us-button").addEventListener('click',() =>
			{window.location.href="main.html#about-us"}
		);
		document.getElementById("contact-us-button").addEventListener('click',() =>
			{window.location.href="main.html#contact-us"}
		);
		
		document.getElementById("history-button").addEventListener('click',() =>
			{window.location.href="history.html"}
		);
		document.getElementById("events-button").addEventListener('click',() =>
			{window.location.href="events.html"}
		);
	}

	//2. manage separately the 'jolly-button' and dynamic menu resizing
	enableMainMenuJollyButton(){
		let documentStyles = getComputedStyle(document.documentElement);
		let criticalWidth  = parseInt(documentStyles.getPropertyValue('--menu-requires-overflow-list').trim());
		let okMinimumWidth = parseInt(documentStyles.getPropertyValue('--menu-can-be-restored-properly').trim());
	   
		let overflowContainer = document.getElementById('overflow-container');
		let jollyButton = document.getElementById('jolly-button');
		let menuItems   = document.getElementById('menu-items');
		let menuParent  = menuItems.parentElement;	
		
		jollyButton.addEventListener('click',() =>{});  //initialize the click listener
		
		let b = new BoundsWatcher(
			() => window.innerWidth <= criticalWidth,
			() => { 
			        menuParent.removeChild(menuItems);
					overflowContainer.appendChild(menuItems);
					//assign jolly-button expand-collapse function
					jollyButton.innerHTML="☰";
					jollyButton.onclick = () =>{overflowContainer.hidden = !overflowContainer.hidden;};  
				  },
			() => window.innerWidth >= okMinimumWidth,
			() => {
					try{
						overflowContainer.hidden = true;                  //the first time the second one it will throw an exception.	                  
						overflowContainer.removeChild(menuItems);         //that's fine, cause on the first time 
						menuParent.insertBefore(menuItems,jollyButton);   //these instructions don't need to be executed 
					}catch(DOMException){
						//console.log(DOMException);
					}                                //insertBefore must be specified, else the menuItems is appended AFTER the jollyButton
					//assign jolly-button home function
					jollyButton.innerHTML='Home';
					jollyButton.onclick = () =>{window.location.href="main.html";};
				  }	
		);
		
		window.addEventListener('resize', () => b.handleOverflowItems());
		b.handleOverflowItems();      //run once to initialize the jolly-button
	}
	
	//CREATE THE FOOTER NOTE, FOR EASY UPDATE AND USE ON ALL WEBPAGES	
	createFooterNote(){
		let footerNote = document.createElement('div');
		
		footerNote.id = "footer-note";
	    footerNote.className = "common-container";
		
		// <div id="footer" class="common-container">
		footerNote.innerHTML = `
		    <h2>Seguici sui social e diffondi la voce!</h2>	
			<div class="style-square-image add-hig-spacing">
			    <a href="https://www.facebook.com/centroequilibriopsicofisico" target="_blank"><img src="assets/images/social/facebook.webp"></img></a>
			    <a href="https://www.instagram.com/centroequilibriopsicofisico" target="_blank"><img src="assets/images/social/instagram.webp"></img></a>
				<a href="https://whatsapp.com/yourprofile" target="_blank"><img src="assets/images/social/whatsapp.webp"></img></a>
            </div>
            <p class="add-high-vert-spacing">COPYRIGHT © 2014-${new Date().getFullYear()} - Centro Equilibrio Psicofisico di Lauretana Trevisi - tutti i diritti riservati</p>			
		`;		
		document.body.appendChild(footerNote);
	}

	//HANDLE THE EXPANDABLE-CONTAINER EXPANSION/COLLAPSE
	expandableContainerEnableExpandCollapse(){
		const items = document.querySelectorAll('.expandable-container');
			items.forEach(item => { 
				item.querySelector('.expandable-container-title,.expandable-container-title-plain').addEventListener('click', () => 
					{item.classList.toggle('clicked');}
				);
			});
	}

	//HANDLE THE TEXT PREVIEW GENERATION FOR OBJECTS BELONGING TO EXPANDABLE-CONTAINER-PREVIEW CLASS, 
	//that i consider an extension (in java sense) of expandable-container. 
	//Parent container must be selected and its class edited to temporarily alter the bootstrap grid alignment
	expandableContainerEnablePreviewGenerateText(){		    
		const conts = document.querySelectorAll('.expandable-container-preview');
			conts.forEach(cont => {
				let parent            = cont.parentElement;
				let originalClassList = [...parent.classList];    //copy each value of the original list into an array: spread operator
				
				let text = cont.querySelector('.expandable-container-text').innerHTML.replace(/\n|\t/g,"").substring(0,100)+"...";  //html indentation can introduce these unwanted characters
				let p    = document.createElement('p');           //create a paragraph to include the preview text
				p.textContent = text;
				p.classList.add("add-min-vert-spacing");
				let title = cont.querySelector('.expandable-container-title');
				title.appendChild(p);
				
				let clicked = true;
				title.addEventListener('click', () =>
					{
						if(clicked){
							clicked = false;
							title.removeChild(p); 
							for (const cls of originalClassList)  //remove all the class attributes associated to the parent to reset its positioning; use the copied array to perform this operation
								parent.classList.remove(cls);     //the classList is a list data structure, called DOMTokenList
								//console.log('removed: '+ cls + 'now currentstate is: ' + parent.classList);}
						}
						else{
							clicked = true;
							title.appendChild(p);
							for (const cls of originalClassList)  //add back all the class attributes associated to the parent to restore its positioning
								parent.classList.add(cls);
								//console.log('added: ' + cls + 'now currentstate is: ' + parent.classList);}
						}
						
						cont.scrollIntoView({     //compensate possible unexpected repositioning of the item by centering the view on it- i know, i should do better than this but should be enough
							behavior: "smooth",   // smooth scrolling
							block:    "center",   // center vertically
							inline:   "center"    // center horizontally (if horizontal scroll)
						});
					}
				);
			});
	}
	
	//ENABLE DYNAMIC PRESENTATION OF CONTENTS
	enableElementsSpawning(){
		const observer = new IntersectionObserver((entries,observer) =>{
			entries.forEach(entry =>{
				if(entry.isIntersecting){
					entry.target.classList.toggle('observed');
					observer.unobserve(entry.target);
				}
			});
			}, {threshold:0.3}     //threshold percentage of visibility of the area, where the item is actually located inside, before action
		); 
		
		let toSpawns = document.querySelectorAll('.spawn-element');
		for(const toSpawn of toSpawns)
			observer.observe(toSpawn);
	}

	//HANDLE LOCATION SWITCHING ON GOOGLE MAPS IFRAME: hardwired for two cases only
	switchAvailableLocations(){
		let frame = document.getElementById('locations');
		let label = document.getElementById('locations-name');
		let prev  = document.getElementById('locations-prev');
		let next  = document.getElementById('locations-next');
		
		if(!frame) return;
		
		let switchplace = true;
		
		function switching(){				
			if(switchplace){
				switchplace = false;
				frame.setAttribute('src',"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2964.7236074043435!2d12.948246675368924!3d42.00620695738483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f9afbdd4fa15d%3A0xc5aff1f279225028!2sLocalit%C3%A0%20Macchiole%2C%201%2C%2000020%20Macchiole%20RM!5e0!3m2!1sen!2sit!4v1757720275993!5m2!1sen!2sit");
				label.innerHTML = 'Sede I: Saracinesco RM<br>(attività individuali e di gruppo)';
			}
			else{
				switchplace = true;
				frame.setAttribute('src',"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.43056975565!2d12.509047275361945!3d41.883596365071035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f61eb6ef598dd%3A0xfa46dd4a6db1f03d!2sVia%20Appia%20Nuova%2C%2096%2C%2000138%20Roma%20RM!5e0!3m2!1sen!2sit!4v1758812583185!5m2!1sen!2sit");
				label.innerHTML = 'Sede II: nel cuore di Roma<br>(attività individuali)';
			}
		}
		
		switching();  //invoke one time to initialize
		
		prev.addEventListener('click',switching);
		next.addEventListener('click',switching);			
	}
	
	//SINCE THIS ITEM IS REUSED ACROSS PAGES, IT HAS BEEN EDITED AS PROCEDURALLY GENERATED
	createForm(){
		let pos = document.getElementById("insert-form-as-inner-html");
		if(!pos) return;
		
		pos.innerHTML = `
		    <form id="contact-form">
			    <input class="common-overlaid-container add-min-vert-spacing form-control" name="name" type="text" placeholder="Nome" required>
				<input class="common-overlaid-container add-min-vert-spacing form-control" name="surname" type="text" placeholder="Cognome" required>
				<input class="common-overlaid-container add-min-vert-spacing form-control" name="email" type="email" placeholder="e-mail" required>
				<textarea class="common-overlaid-container add-min-vert-spacing form-control" name="message" rows="6" placeholder="Inserisci messaggio..." required></textarea>
				<input class="common-container common-button add-med-vert-spacing" name="" type="submit" value="Invia">
				<!-- the only way for the attribute "required" to work is to use input type="submit" instead of a simple button. -->
			</form>
			<!-- <button id="form-submit-button" class="common-container common-button add-med-vert-spacing">Invia</button> -->
		`;
		
		this.#handleFormSubmissions();
	}

	//HANDLE FORM SUBMISSION TO A SERVER ACCEPTING JS GENERATED EMAILS (i use emailjs)
	#handleFormSubmissions(){
		//document.getElementById("form-submit-button").addEventListener('click',() => {
			//let submitter = new FormSubmitter(document.getElementById("contact-form")); 
			//alert(submitter.submit()); 
		// }); 
		let btn = document.getElementById("contact-form");
		if(!btn) return;
		
		btn.addEventListener('submit', async(event) =>{
			event.preventDefault();  //the default action is to empty all the inputs-->
			let submitter = new FormSubmitter(document.getElementById("contact-form"));
			let outputstr = await submitter.submit();
			alert(outputstr);
		});
	}
	
	//ENABLE THE PARALLAX EFFECT: MANAGE THE IMAGE SIZES DYNAMICALLY, AND HANDLE THE CASE OF A SCREEN WITH INSUFFICIENT WIDTH
	enableParallaxEffect(){
			//the parallax can work ONLY if you hardwire the initial height of each image, absolute to the first layer, in the images themselves.
			//if you, like me, think that you can dynamically set the inital vertical height of the images, you will fail.
			//the reason: setting an initial location in pixel will desync one layer from another if the images are resized (and they are)
			let parallaxContainer = document.getElementById("parallax-container");
			if(!parallaxContainer) return;              //avoid exception if no such element
			
			let layers = parallaxContainer.querySelectorAll("img");
			for(let i=0;i<layers.length;i++){   
				layers[i].classList.add("img-fluid");   //the bootstrap property to dynamically resize image to not overflow the external bounds. However, if the image is smaller than the bounds, this property does not resize automatically: the image stays at its max size
				layers[i].style.zIndex   = -1;          //necessary to avoid overlap with other elements in the document, that by default have index=0.
				layers[i].style.position = "absolute";  //the condition to correctly stack each image to their initial position: use coordinates of the ancestor element
			}
			
			window.addEventListener('scroll', () => {
				const scrollTop = -window.pageYOffset;  //the amount of scroll
				for(let i=0;i<layers.length;i++){   
					const speed = parseFloat(layers[i].dataset.speed);
					layers[i].style.transform = `translateY(${scrollTop * speed}px)`;
				}
			});
			
			//parallaxContainer.style.zIndex = -1;
			//parallaxContainer.style.height = "110vh";
			
			let documentStyles = getComputedStyle(document.documentElement);
			let minWidth = parseInt(documentStyles.getPropertyValue('--parallax-requires-overflow').trim());
			let okWidth  = parseInt(documentStyles.getPropertyValue('--parallax-can-be-restored').trim());
			
			let b2 = new BoundsWatcher(
				() => window.innerWidth <= minWidth,
				() => {
					for(let i=0;i<layers.length;i++){
						layers[i].classList.toggle("img-fluid", false);
						layers[i].style.width = okWidth + "px";
					}
				},
				() => window.innerWidth >= okWidth,
				() => {
					for(let i=0;i<layers.length;i++){
						layers[i].classList.toggle("img-fluid", true);
						layers[i].style.width = "auto";
					}
				}
			);
			
			window.addEventListener('resize',() => b2.handleOverflowItems());
			b2.handleOverflowItems();			
	}
	
	enableReserveSpotButton(){
		let butt = document.getElementById("reserve-spot-button");
		if(!butt) return;
		
		butt.addEventListener('click',()=>{
			window.location.href = "payment-info.html";
		});
	}
}