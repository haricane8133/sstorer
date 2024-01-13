import * as fs from "fs-extra";
const _ = require('lodash');

export class Sstorer{
    duration: number | undefined;

    autospawnsession: boolean = false;

    defaultSessionVariables: Object = {};

    persistFileName: string | undefined;

    /**
     * After the given duration, the storage is invaid
     * @param options Execution Options
     */
    constructor(options?: InitOptions) {
        this['storage'] = {};
        this.duration = _.get(options, 'duration', undefined);
        this.autospawnsession = _.get(options, 'autospawnsession', true);
        this.defaultSessionVariables = _.get(options, 'defaultSessionVariables', {});
        this.persistFileName = _.get(options, 'persistFileName', '');

        this.load(this.persistFileName);
    }
    /**
     * This is to change the duration of each session
     * @param duration Duration of each session in minutes
     */
    setDuration(duration: number | undefined){
        this.duration = duration;
        this.dump(this.persistFileName);
    }
    /**
     * This is to refresh the timer in the session
     * @param sessionid This is a unique key that contains it's separate data
     * @returns false - If session is already dead
     * @returns true - If session has been successfully refreshed
     */
    refreshSession(sessionid: string): boolean{
        if(this.isSessionActive(sessionid)){
            this['storage'][sessionid]['timestamp'] = Date.now()/1000;
            this.dump(this.persistFileName);
            return true;
        } else {
            return false;
        }
    }
    /**
     * Starts a new unit of storage for the given sessionid
     * @param sessionid This is a unique key that contains it's separate data
     */
    spawnSession(sessionid: string): void{
        this['storage'][sessionid] = this.defaultSessionVariables;
        this.refreshSession(sessionid);
    }
    /**
     * Destroys the storage under this sessionid
     * @param sessionid This is a unique key that contains it's separate data
     */
    killSession(sessionid: string): void{
        this['storage'][sessionid] = undefined;
        this.dump(this.persistFileName);
    }

    /**
     * Returns true if the the session was spawned (if sstorer handled the session id before)
     * @param sessionid This is a unique key that contains it's separate data
     * @returns True if the session was spawned earlier
     * @returns False if the session hasn't been spawned yet
     */
    hasSessionSpawned(sessionid: string) {
        return this['storage'][sessionid] != undefined;
    }

    /**
     * Returns true if the the session is active (time elapsed under 'duration')
     * @param sessionid This is a unique key that contains it's separate data
     * @returns True if the session is active
     * @returns False if the session has expired
     */
    isSessionActive(sessionid: string): boolean{
        if(!this.hasSessionSpawned(sessionid) || (typeof this.duration === 'number' && (Date.now()/1000 - this['storage'][sessionid]['timestamp'] > this.duration*60))){
            this.killSession(sessionid);
            return false;
        } else{
            return true;
        }
    }
    /**
     * Add / Modify a Variable in the session storage
     * 
     * Auto refreshes the session
     * 
     * Auto performes the session activeness check
     * @param sessionid This is a unique key that contains it's separate data
     * @param paramName The name of the variable that you want to store
     * @param paramVal The value of the variabe that you want to store
     * @returns True if the session is active and the value is inserted
     * @returns False if the session has expired and storage was not done
     */
    putVar(sessionid: string, paramName: string, paramVal: any): boolean{
        if(this.isSessionActive(sessionid)){
            this['storage'][sessionid][paramName] = paramVal;
            this.refreshSession(sessionid);
            this.dump(this.persistFileName);
            return true;
        } else if(!this.hasSessionSpawned(sessionid) && this.autospawnsession) {
            this.spawnSession(sessionid);
            this['storage'][sessionid][paramName] = paramVal;
            this.dump(this.persistFileName);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get the value of a variabe from the session store
     * @param sessionid This is a unique key that contains it's separate data
     * @param paramName The name of the variable that you want to get
     * @returns false if the session is not alive
     * @returns undefined if there is no such variable is declared in the session
     * @returns The value of the variable if al OK
     */
    getVar(sessionid: string, paramName: string): any {
        if(this.isSessionActive(sessionid)){
            return this['storage'][sessionid][paramName];
        } else{
            return false;
        }
    }

    /**
     * Stores the data present to the file fname
     * @returns True if successful, False if not
     */
    dump(fname: string | undefined): boolean{
        try{
            fs.writeJSONSync(fname!, this); // ! used as we have try {} to cover
            return true;
        } catch{ return false;}
    }

    /**
     * Loads the data from the file fname
     * @returns True if successful, False if not
     */
    load(fname: string | undefined): boolean{
        try{
            let tmp = fs.readJSONSync(fname!); // ! used as we have try {} to cover
            this['storage'] = tmp['storage'];
            this['duration'] = tmp['duration'];
            return true;
        } catch { return false;}
    }
}

/**
 * The interface explaining options that the user must pass when instantiating sstorer
 * In case one of the options you add here are absolutely mandatory for the user,
 *     make sure you change the function signature of the init() method to mandate the options object 
 */
interface InitOptions {
    /**
     * Duration of each session in minutes.
     * Omit this if the session has no expiry
     */
    duration?: number;

    /**
     * When inserting variables, autospawn session if not already available.
     * (create new session when you are inserting variables for a new session)
     * (instead of having to call spawnSession() before inserting variables)
     */
    autospawnsession?: boolean;

    /**
     * An Object containing variables that you want for each Session to get initialized with
     */
    defaultSessionVariables?: Object;
    
    /**
     * The name of the file where you want to persist the variables.
     * Even if you do not set it here, you have the option to dump() and load() data from any file in runtime.
     */
    persistFileName?: string;
}

/**
 * Returns an object that stores variabes separate for each session, for the given session duration
 * @param options Execution Options
 * @author Hari.R aka haricane8133
 */
export function init(options?: InitOptions){
    return new Sstorer(options);
}