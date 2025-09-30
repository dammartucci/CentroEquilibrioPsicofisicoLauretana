const KEY       = "TFhtYm93MSlBfS6BB";
const SERVICEID = "service_qkz3z3f";
const CONTACTID = "template_0fwkdrp";

const MESSAGES_PER_USER = 2;
const DAYS_TO_RESET     = 14; 
const SERVICE_NAME      = "anti-spam-counter";

class FormSubmitter{	
	constructor(textform){		
		this.textform = textform;
	    this.session  = this.#loadSession();
	}
	
	#loadSession(){
		let session = JSON.parse(localStorage.getItem(SERVICE_NAME));
		let now     = Date.now();
		
		if(!session || now > session.expiry){
			session = {
				id: "sess-" + Math.random().toString(36).substring(2) + now,
				sentCounter: 0,
				expiry: now + DAYS_TO_RESET * 1000 * 60 * 60 * 24,   //convert days to milliseconds				
			};
			localStorage.setItem(SERVICE_NAME,JSON.stringify(session));
		}
		return session;
	}
	
	#loadEmailjs(){
		if(window.emailjs)
		    return Promise.resolve(window.emailjs);
		
		return new Promise((resolve, reject) => {
		    let jscript = document.createElement("script");
			jscript.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
			jscript.type = "text/javascript";
			
			jscript.onerror = () => {
				reject(new Error("Si è verificato un errore nel caricamento del gestore di terze parti del form.\n" + 
				                 "Scrivere una email direttamente a centroequilibriopsicofisico@gmail.com"));
			}
			jscript.onload  = () => {
				emailjs.init({
		            publicKey: KEY,	
		        });
				resolve(window.emailjs);
			}
			document.head.appendChild(jscript);
		});
	}
	
	async submit(){	
	    if(this.session.sentCounter >= MESSAGES_PER_USER)
			return "A causa della limitatezza di risorse computazionali, non puoi inviare più di\n" + 
		    MESSAGES_PER_USER + " messaggi in " + DAYS_TO_RESET + " giorni. Attendi una risposta\n" + 
			"da parte dello staff, e avvia così una conversazione.";
        else try{
			let emailjs  = await this.#loadEmailjs();
			let response = await emailjs.sendForm(SERVICEID,CONTACTID,this.textform);	
			if(response.status === 200){
				this.session.sentCounter++;
			    return "Grazie per averci contattato! Una risposta ti arriverà a breve sulla email da te indicata.";	
			}
		}catch(error){
			console.log("an emailjs error occurred: ");
			console.log(error);
			//if(error.status === 400 || error.status === 401 || error.status === 403 || error.status === 429 || error.status === 500)
				return "Ci scusiamo!\n" + 
					   "Il servizio di terze parti di invio sta impedendo tale richiesta.\n" + 
					   "Chiediamo la tua collaborazione. Segui queste istruzioni:\n"+
					   "Copia e incolla il contenuto del tuo messaggio in una email con destinatario centroequilibriopsicofisico@gmail.com.\n" + 
					   "Scrivi nell'oggetto \"ERRORE: " + error.status + "\"";
		}
	}
}