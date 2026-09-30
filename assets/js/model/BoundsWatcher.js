/*  
	Custom design & development 
	COPYRIGHT ® 2025 Damiano Martucci, AFSI SRLs. All rights reserved.
	AUTHOR: Damiano Martucci <damiano.martucci.business@gmail.com>
				
	This code is proprietary and confidential. Unauthorized copying 
	of this file, via any medium, is strictly prohibited. 
*/


class BoundsWatcher{
		
	constructor(lowerBoundCondition,handleLowerBoundCrossed,upperBoundCondition,handleUpperBoundCrossed){
		this.lowerBoundCondition = lowerBoundCondition;
		this.upperBoundCondition = upperBoundCondition;
		this.handleLowerBoundCrossed = handleLowerBoundCrossed;
		this.handleUpperBoundCrossed = handleUpperBoundCrossed;		
		
		this.hasCrossedL = false;  //a NOR latch: both can't be true
		this.hasCrossedH = false;  //these variables exist to ensure the associated operation is performed one time
	}
	
	handleOverflowItems(){		
		if(!this.hasCrossedL && this.lowerBoundCondition()){   //case 1: the lower bound has been crossed
			this.hasCrossedL = true;
			this.hasCrossedH = false;
			this.handleLowerBoundCrossed();
		}
		
		if(!this.hasCrossedH && this.upperBoundCondition()){  //case 2: the upper bound has been crossed
			this.hasCrossedL = false;
			this.hasCrossedH = true;
			this.handleUpperBoundCrossed();
		}
	}
}	
