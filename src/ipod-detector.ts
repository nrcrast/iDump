import { Ipod } from "./ipod";
import * as drivelist from 'drivelist';
import { checkFsExists } from "./check-fs-exists";
import * as path from 'path';

export class IpodDetector {
    private static async isIpodDir(directory: string): Promise<boolean> {
        const exists = checkFsExists(path.join(directory, 'iPod_Control'));
        return exists;
    }
    static async find(): Promise<Ipod[]> {
        const drives = await drivelist.list();
        
        const mappedDrives = await Promise.all(drives.map(async (drive) => {
            const isIpod = await IpodDetector.isIpodDir(drive.mountpoints?.[0].path);

            return {
                path: drive.mountpoints?.[0].path,
                isIpod
            };
        }));

        const iPods = mappedDrives.filter(drive => drive.isIpod).map(drive => new Ipod(drive.path));
        return iPods;
    }
}