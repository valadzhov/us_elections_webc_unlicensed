import { BehaviorSubject } from 'rxjs';

class StateService {
	public currentlyChosenYear: BehaviorSubject<number> = new BehaviorSubject<number>(2024);
}
export const stateService: StateService = new StateService();
