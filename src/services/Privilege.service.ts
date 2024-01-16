import { AppDataSource } from "../data-source";
import { Privilege } from "../entity/Privilege";

export class PrivilegeService {
    private _privilegeRepository = AppDataSource.getRepository(Privilege);

    async getPrivilegesFromScopes(scopes: string[]): Promise<Privilege[]> {
        const privileges: Privilege[] = [];
        await Promise.all(scopes.map(async (scope) => {
            const privilege = await this._privilegeRepository.findOne({ where: { scope } });
            if (privilege) {
                privileges.push(privilege);
            }
        }));
        return privileges;
    }
}