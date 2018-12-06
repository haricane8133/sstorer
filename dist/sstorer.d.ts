export declare class Sstorer {
    /**
     * Denotes the session duration in minutes
     */
    duration: number;
    /**
     * After the given duration, the storage is invaid
     * @param duration Duration of each session in minutes
     */
    constructor(duration: number);
    /**
     * This is to change the duration of each session
     * @param duration Duration of each session in minutes
     */
    setDuration(duration: number): void;
    /**
     * This is to refresh the timer in the session
     * @param sessionid This is a unique key that contains it's separate data
     * @returns false - If session is already dead
     * @returns true - If session has been successfully refreshed
     */
    refreshSession(sessionid: any): boolean;
    /**
     * Starts a new unit of storage for the given sessionid
     * @param sessionid This is a unique key that contains it's separate data
     */
    spawnSession(sessionid: any): void;
    /**
     * Destroyes the storage under this sessionid
     * @param sessionid This is a unique key that contains it's separate data
     */
    killSession(sessionid: any): void;
    /**
     * Returns true if the the session is active (time elapsed under 'duration')
     * @param sessionid This is a unique key that contains it's separate data
     * @returns True if the session is active
     * @returns False if the session has expired
     */
    isSessionActive(sessionid: any): boolean;
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
    putVar(sessionid: any, paramName: any, paramVal: any): boolean;
    /**
     * Get the value of a variabe from the session store
     * @param sessionid This is a unique key that contains it's separate data
     * @param paramName The name of the variable that you want to get
     * @returns false if the session is not alive
     * @returns undefined if there is no such variable is declared in the session
     * @returns The value of the variable if al OK
     */
    getVar(sessionid: any, paramName: any): any;
    /**
     * Stores the data present to the file fname
     * @returns True if successful, False if not
     */
    dump(): boolean;
    /**
     * Loads the data from the file fname
     * @returns True if successful, False if not
     */
    load(): boolean;
}
/**
 * Returns an object that stores variabes separate for each session, for the given session duration
 * @param duration
 * @author Hari.R aka haricane8133
 */
export declare function init(duration: number): Sstorer;
