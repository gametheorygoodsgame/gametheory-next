import { MoveNumRedCardsEnum } from '@gametheorygoodsgame/gametheory-openapi/api';

/**
 * This function checks if the given number matches any of the values in the `MoveNumRedCardsEnum`.
 * If it does, the number is returned as a valid enum value. Otherwise, an error is thrown.
 *
 * @param {number} num - The number to validate against the `MoveNumRedCardsEnum`.
 * @returns {(typeof MoveNumRedCardsEnum)[keyof typeof MoveNumRedCardsEnum]} 
 * The corresponding value from the `MoveNumRedCardsEnum`.
 * @throws {Error} Throws an error if the number is not a valid value in the enum.
 */
export function getMoveNumRedCardEnumValue(
    num: number
): (typeof MoveNumRedCardsEnum)[keyof typeof MoveNumRedCardsEnum] {
    if (Object.values(MoveNumRedCardsEnum).includes(num as 0 | 1 | 2)) {
        return num as (typeof MoveNumRedCardsEnum)[keyof typeof MoveNumRedCardsEnum];
    }
    throw new Error(`Invalid number: ${num}`);
}
