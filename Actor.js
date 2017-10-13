// Actor variables
var CurrentActor;
var Actor = [];
var ActorName = 0;
var ActorLove = 1;
var ActorSubmission = 2;
var ActorInventory = 3;
var ActorOrgasmCount = 4;
var ActorBondageCount = 5;
var ActorLastBondageChapter = 6;
var ActorCloth = 7;

// Make sure the current actor is loaded (create it if not)
function ActorLoad(ActorToLoad, ActorLeaveScreen) {
	
	// Keep the actor leave screen
	LeaveIcon = "Leave";
	LeaveScreen = ActorLeaveScreen;

	// Load the actor if it's not already loaded
	CurrentActor = ActorToLoad;
	for (var L = 0; L < Actor.length; L++)
		if (Actor[L][ActorName] == ActorToLoad)
			return;
	Actor[Actor.length] = [ActorToLoad, 0, 0, [], 0, 0, "", "Clothed"];
	
}

// Return a value from the current actor data
function ActorGetValue(ValueType) {
	for (var L = 0; L < Actor.length; L++)
		if (CurrentActor == Actor[L][ActorName])
			return Actor[L][ValueType];	
}

// Return a value from a specific actor data
function ActorSpecificGetValue(SpecificActorName, ValueType) {
	for (var L = 0; L < Actor.length; L++)
		if (SpecificActorName == Actor[L][ActorName])
			return Actor[L][ValueType];	
}

// Change positively or negatively the current actor attitude toward the player
function ActorChangeAttitude(LoveAttitude, SubAttitude) {
	
	// If we need to make a change to the attitude, we apply it
	if ((LoveAttitude != 0) || (SubAttitude != 0))
		for (var L = 0; L < Actor.length; L++)
			if (CurrentActor == Actor[L][ActorName]) {
				Actor[L][ActorLove] = Actor[L][ActorLove] + parseInt(LoveAttitude);
				Actor[L][ActorSubmission] = Actor[L][ActorSubmission] + parseInt(SubAttitude);
			}	

}

// Change positively or negatively a specific actor attitude toward the player
function ActorSpecificChangeAttitude(SpecificActorName, LoveAttitude, SubAttitude) {
	
	// If we need to make a change to the attitude, we apply it
	if ((LoveAttitude != 0) || (SubAttitude != 0))
		for (var L = 0; L < Actor.length; L++)
			if (SpecificActorName == Actor[L][ActorName]) {
				Actor[L][ActorLove] = Actor[L][ActorLove] + parseInt(LoveAttitude);
				Actor[L][ActorSubmission] = Actor[L][ActorSubmission] + parseInt(SubAttitude);
			}	

}

// Add an orgasm to the actor count
function ActorAddOrgasm() {	
	for (var L = 0; L < Actor.length; L++)
		if (CurrentActor == Actor[L][ActorName])
			Actor[L][ActorOrgasmCount]++;
}

// Validates that a specific interaction stage is available for the player
function ActorInteractionAvailable(LoveReq, SubReq, VarReq, InText, ForIntro) {
	
	// Make sure the love / sub level is match (both positive and negative)
	VarReq = VarReq.trim();
	InText = InText.trim();
	if ((parseInt(LoveReq) > 0) && (parseInt(ActorGetValue(ActorLove)) < parseInt(LoveReq))) return false;
	if ((parseInt(SubReq) > 0) && (parseInt(ActorGetValue(ActorSubmission)) < parseInt(SubReq))) return false;
	if ((parseInt(LoveReq) < 0) && (parseInt(ActorGetValue(ActorLove)) > parseInt(LoveReq))) return false;
	if ((parseInt(SubReq) < 0) && (parseInt(ActorGetValue(ActorSubmission)) > parseInt(SubReq))) return false;
	
	// Checks if there's a customer script variable or a common variable to process
	if ((VarReq != "") && (VarReq.substr(0, 7) == "Common_") && (window[VarReq] == false)) return false;
	if ((VarReq != "") && (VarReq.substr(0, 8) == "!Common_") && (window[VarReq.substr(1)] == true)) return false;
	if ((VarReq != "") && (VarReq.substr(0, 7) != "Common_") && (VarReq.substr(0, 1) != "!") && (window[CurrentChapter + "_" + CurrentScreen + "_" + VarReq] == false)) return false;
	if ((VarReq != "") && (VarReq.substr(0, 7) != "Common_") && (VarReq.substr(0, 1) == "!") && (window[CurrentChapter + "_" + CurrentScreen + "_" + VarReq.substr(1)] == true)) return false;
	
	// Check if the player is gagged, only interactions that starts with ( or @ are allowed
	if ((InText.substr(0, 1) != "(") && (InText.substr(0, 1) != "@") && Common_PlayerGagged && !ForIntro) return false;
	
	// Since nothing blocks, we allow it
	return true;

}

// Add inventory to the current actor
function ActorAddInventory(NewInventory) {

	// Find the current actor and adds the inventory if it's not already the case
	for (var A = 0; A < Actor.length; A++)
		if (Actor[A][ActorName] == CurrentActor)
			if (Actor[A][ActorInventory].indexOf(NewInventory) == -1) {
				Actor[A][ActorInventory].push(NewInventory);
				if (Actor[A][ActorLastBondageChapter] != CurrentChapter) {
					Actor[A][ActorLastBondageChapter] = CurrentChapter;
					Actor[A][ActorBondageCount]++;
				}
			}

}

// Add 1 to the bondage count of a specific actor
function ActorSpecificAddBondage(SpecificActor) {
	for (var A = 0; A < Actor.length; A++)
		if (Actor[A][ActorName] == SpecificActor)
			Actor[A][ActorBondageCount]++;
}

// Remove inventory from the current actor
function ActorRemoveInventory(RemInventory) {

	// Find the current actor and adds the inventory if it's not already the case
	for (var A = 0; A < Actor.length; A++)
		if (Actor[A][ActorName] == CurrentActor)
			if (Actor[A][ActorInventory].indexOf(RemInventory) >= 0)
				Actor[A][ActorInventory].splice(Actor[A][ActorInventory].indexOf(RemInventory), 1);

}

// Returns true if the current actor has the queried inventory
function ActorHasInventory(QueryInventory) {

	// Cycles to find the correct actor and checks if the inventory is in the list
	var HasInv = false;
	for (var A = 0; A < Actor.length; A++)
		if (Actor[A][ActorName] == CurrentActor)
			if (Actor[A][ActorInventory].indexOf(QueryInventory) >= 0)
				HasInv = true;
	return HasInv;

}

// Sets the clothes for the current actor
function ActorSetCloth(NewCloth) {
	for (var A = 0; A < Actor.length; A++)
		if (Actor[A][ActorName] == CurrentActor)
			Actor[A][ActorCloth] = NewCloth;
}

// Returns true if the actor is restrained
function ActorIsRestrained() {
	return (ActorHasInventory("Rope") || ActorHasInventory("Cuffs"));
}

// Returns true if the actor is gagged
function ActorIsGagged() {
	return (ActorHasInventory("Ballgag") || ActorHasInventory("TapeGag") || ActorHasInventory("ClothGag"));
}

// Returns true if the actor is chaste
function ActorIsChaste() {
	return (ActorHasInventory("ChastityBelt"));
}

// Unties the actor and returns the rope to the player
function ActorUntie() {
	if (ActorHasInventory("Rope")) {
		PlayerAddInventory("Rope", 1);
		ActorRemoveInventory("Rope");
	}
}

// Ungag the actor and returns the item if possible
function ActorUngag() {
	if (ActorHasInventory("Ballgag")) { ActorRemoveInventory("Ballgag"); PlayerAddInventory("Ballgag", 1); }
	if (ActorHasInventory("ClothGag")) { ActorRemoveInventory("ClothGag"); PlayerAddInventory("ClothGag", 1); }
	if (ActorHasInventory("TapeGag")) ActorRemoveInventory("TapeGag");
}

// Tries to apply a restrain on the current actor
function ActorApplyRestrain(RestrainName, RestrainText) {
	
	// If there's no text or the player is restrained, we assume we cannot apply the restrain
	if ((RestrainText.substr(0, 20) != "MISSING TEXT FOR TAG") && (RestrainText != "") && !Common_PlayerRestrained && PlayerHasInventory(RestrainName) && !ActorHasInventory(RestrainName)) {
		
		// Regular restrains
		if ((RestrainName == "Rope") || (RestrainName == "Cuffs")) {
			if (!ActorIsRestrained()) {
				PlayerRemoveInventory(RestrainName, 1);
				ActorAddInventory(RestrainName);
				CurrentTime = CurrentTime + 60000;
			} else return;
		}

		// Regular gags (gags can be swapped)
		if ((RestrainName == "Ballgag") || (RestrainName == "TapeGag") || (RestrainName == "ClothGag")) {
			ActorUngag();
			PlayerRemoveInventory(RestrainName, 1);
			ActorAddInventory(RestrainName);
			CurrentTime = CurrentTime + 60000;
		}

		// Vaginal items (cannot be used if the actor is chaste)
		if ((RestrainName == "ChastityBelt") || (RestrainName == "VibratingEgg")) {
			if (!ActorIsChaste()) {
				PlayerRemoveInventory(RestrainName, 1);
				ActorAddInventory(RestrainName);
				CurrentTime = CurrentTime + 60000;
			} else return;
		}

		// Cuffs key
		if (RestrainName == "CuffsKey") {
			if (ActorHasInventory("Cuffs")) {
				ActorRemoveInventory("Cuffs");
				PlayerAddInventory("Cuffs", 1);
				CurrentTime = CurrentTime + 60000;
			} else return;
		}
		
		// Show the text on the screen and jumps 1 minute
		OveridenIntroText = RestrainText;
		
	}

}

// Returns true if the queried actor has the queried inventory
function ActorSpecificHasInventory(QueryActor, QueryInventory) {

	// Cycles to find the correct actor and checks if the inventory is in the list
	var HasInv = false;
	for (var A = 0; A < Actor.length; A++)
		if (Actor[A][ActorName] == QueryActor)
			if (Actor[A][ActorInventory].indexOf(QueryInventory) >= 0)
				HasInv = true;
	return HasInv;

}

// Clear all inventory from an actor (expect the egg, chastitybelt and collar)
function ActorSpecificClearInventory(QueryActor, Recover) {	
	for (var A = 0; A < Actor.length; A++)
		if (Actor[A][ActorName] == QueryActor) {
			var HadEgg = ActorSpecificHasInventory(QueryActor, "VibratingEgg");
			var HadCollar = ActorSpecificHasInventory(QueryActor, "Collar");
			var HadBelt = ActorSpecificHasInventory(QueryActor, "ChastityBelt");
			while (Actor[A][ActorInventory].length > 0) {
				if ((Actor[A][ActorInventory][0] != "VibratingEgg") && (Actor[A][ActorInventory][0] != "Collar") && (Actor[A][ActorInventory][0] != "ChastityBelt") && (Actor[A][ActorInventory][0] != "TapeGag") && Recover)
					PlayerAddInventory(Actor[A][ActorInventory][0], 1);
				Actor[A][ActorInventory].splice(0, 1);
			}
			if (HadEgg) Actor[A][ActorInventory].push("VibratingEgg");
			if (HadCollar) Actor[A][ActorInventory].push("Collar");
			if (HadBelt) Actor[A][ActorInventory].push("ChastityBelt");
		}
}

// Returns the actor image file to use
function ActorSpecificGetImage(QueryActor) {
	
	// The image file name is constructed from the inventory
	var ActorImage = QueryActor;
	if (ActorSpecificHasInventory(QueryActor, "Cuffs")) ActorImage = ActorImage + "_Cuffs";
	if (ActorSpecificHasInventory(QueryActor, "Rope")) ActorImage = ActorImage + "_Rope";
	if (ActorSpecificHasInventory(QueryActor, "Ballgag")) ActorImage = ActorImage + "_Ballgag";
	if (ActorSpecificHasInventory(QueryActor, "TapeGag")) ActorImage = ActorImage + "_TapeGag";
	return ActorImage;

}