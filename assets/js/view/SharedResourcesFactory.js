/*  
    Custom design & development 
    COPYRIGHT ® 2025 Damiano Martucci, AFSI SRLs. All rights reserved.
	AUTHOR: Damiano Martucci <damiano.martucci.business@gmail.com>
    
	This code is proprietary and confidential. Unauthorized copying 
	of this file, via any medium, is strictly prohibited. 
*/

class SharedResourcesFactory{
	
	/*public*/ static /*String[]*/ getBrowsablesNodeInnerHTML(imgDirsStrArr){
		let browsablesNodeStrArr = [];                 //handle the case where the event supports a carousel of images
		for(let i=0;i<imgDirsStrArr.length;i++)              
			browsablesNodeStrArr.push(`<img class="fluid-element" src="${imgDirsStrArr[i]}"></img>`);
        return browsablesNodeStrArr;		
	}
	
	/*public*/ static /*String*/ getEventOngoingState(isOngoingBool){
	    if(isOngoingBool)
			return "È ancora in corso, dunque puoi partecipare alle lezioni e interagire in diretta con Lauretana!";
		else
	        return "Non è più in corso, tuttavia puoi ascoltare le registrazioni audio!";
	}
    
	/*public*/ static /*String*/ getPaymentInfo(moneySumNum,eventNameStr){    
		if(moneySumNum > 0)
			return `<div class="add-med-vert-spacing"></div>
			Accettiamo per ora solo pagamenti con <b>bonifico</b>. Ecco le informazioni da sapere per compilarne uno:<br>
			<div class="add-med-vert-spacing"></div>
			
			<div class="common-overlaid-container add-med-spacing spawn-element">
			    Per comodità, <b>clicca</b> su ciascuna casella di testo per copiare negli appunti.<br>Gli elementi in <i>corsivo</i> sono da sostituire con i tuoi dati: 
				
				<div class="flex-container wrap add-med-spacing">
					<div>IBAN: <button class="common-menu-button copyable">IT95J0200805046000107366563</button></div>
					<div>Nome intestatario: <button class="common-menu-button copyable">Lauretana Trevisi</button></div>
					<div>Causale: <button class="common-menu-button copyable"><label id="event-name">${eventNameStr}</label>, <i>NOME COGNOME</i>, <i>E-MAIL</i></button></div>
				    <div>Importo: € <button class="common-menu-button copyable"><label id="event-cost">${moneySumNum}</label></button></div>
				</div>
			</div>
			<div class="common-container">
				<h2>Come funziona il processo di pagamento?</h2>
				
				<h4>Per essere più chiari, si compone in ordine di questi passaggi:</h4>
				<div class="common-overlaid-container add-med-spacing">
					<ol style="text-align:left">
					<li><b>effettua il pagamento</b> con i dati suddetti;</li>
					<li><b>compila il form</b> qui in fondo alla pagina, fornendo i dati richiesti dallo stesso, e scrivendo nel messaggio di aver effettuato il pagamento per questo eventi, il cui nome, come vedi, è la prima voce della causale.</li>
					</ol>
				</div>
				<h4>Che cosa accade dopo?</h4>
				<div class="common-overlaid-container add-med-spacing">
					Una volta ricevuto il pagamento e il messaggio, sulla <i>e-mail</i> da te indicata nel form arriveranno le informazioni per partecipare agli eventi acquistati. 
					Se si tratta di lezioni <i>on-line</i> (in linea), queste vengono registrate in audio, ed inviateti per la durata di quindici giorni.<br> 
					Ciò consente di <b>riesplorare</b> le lezioni stesse, oppure di vedere le stesse se sei stato <b>impossibilitato</b> da eventi personali.<br><br>
			    </div>
				<h4>Opzione di partecipazione parziale</h4>
				<div class="common-overlaid-container add-med-spacing">
					Se l'evento si compone di un ciclo di lezioni, e vuoi partecipare solo ad un sottoinsieme di queste, puoi pagare solo quelle che ti interessano.<br>
					Per saperne di più, compila il form.
                    <div class="requires-form"></div>					
			    </div>
			</div>`;
			
			else return `<h3>Con questa lezione gratuita avrai l'occasione di conoscere un nuovo percorso per la tua vita.
				 Lauretana sarà lieta di accoglierti nella sua Classe, se vorrai proseguire. 
			</h3> 
		
			<div class="add-hig-vert-spacing"></div>
		
			Le informazioni per la riunione sono le seguenti:
		
			<div id="event-info" class="common-overlaid-container add-med-spacing spawn-element">
				Le info devono essere generate su richiesta. Contatta Lauretana.
			</div>
			`;
		}
		
		/*public*/ static /*String*/ getPunctualityRules(){
			return `Chiediamo inoltre una cosa molto importante: la puntualità.<br> 
			È infatti essenziale per garantire efficienza, e un'esperienza di apprendimento eccellente per tutti.<br>
			
			<div class="common-overlaid-container expandable-container add-med-spacing togglable spawn-element">
				<div class="expandable-container-title">Qual è il margine massimo accettabile di ritardo?</div>
				<div class="expandable-container-content"> 
					<text>È sempre di quindici minuti. L'insegnante, in quel tempo, è occupato 
					a fare l'introduzione di ciò che sarà trattato nella lezione. </text>
				</div>
			</div>
			
			<!--div class="common-overlaid-container expandable-container add-med-spacing togglable spawn-element">
				<div class="expandable-container-title">Gestione Partita IVA</div>
				<div class="expandable-container-content"> 
					<text>text</text>
				</div>
			</div-->
            
			<div class="common-overlaid-container expandable-container add-med-spacing togglable spawn-element">
				<div class="expandable-container-title">Che cosa accade se supero il margine di ritardo?</div>
				<div class="expandable-container-content"> 
				    <div class="common-overlaid-container expandable-container add-med-spacing spawn-element">
						<div class="expandable-container-title">In presenza</div>
						<div class="expandable-container-content"><text>
				            Non è ancora stato deciso. Si vedrà sul momento.
						</text></div>
					</div>
					
					<div class="common-overlaid-container expandable-container add-med-spacing spawn-element">
						<div class="expandable-container-title">A distanza</div>
						<div class="expandable-container-content"><text>
				            Non sarà più possibile unirsi alla riunione. Sarà tuttavia, al termine di essa, 
							inviato un link per vedere una ripetizione della stessa. 
						</text></div>
					</div>   
				</div>
			</div>

			<div class="common-overlaid-container expandable-container add-med-spacing spawn-element">
				<div class="expandable-container-title">Ma tutto ciò non implica un rigore eccessivo?</div>
				<div class="expandable-container-content"><text>
				    Ecco che cosa dice l'insegnante, Lauretana, a riguardo:<br>
					<i>"È vero, sembra così, ma credimi, per esperienza, è davvero insopportabile, sia per me che per gli altri, 
					essere interrotti nella concentrazione da qualcuno che si presenta in ritardo, che, inoltre, avrà difficoltà 
					a capire che cosa si sta facendo, peggiorando così sia la sua che l'altrui qualità della lezione".</i>
				</text></div>
			</div>`;
		}
}
