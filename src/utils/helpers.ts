import { MoveNumRedCardsEnum } from '@gametheorygoodsgame/gametheory-openapi/api';

export function getMoveNumRedCardEnumValue(
    num: number
): (typeof MoveNumRedCardsEnum)[keyof typeof MoveNumRedCardsEnum] {
    if (Object.values(MoveNumRedCardsEnum).includes(num as 0 | 1 | 2)) {
        return num as (typeof MoveNumRedCardsEnum)[keyof typeof MoveNumRedCardsEnum];
    }
    throw new Error(`Invalid number: ${num}`);
}
