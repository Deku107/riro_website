// Shared component types (plain JavaScript version)

/**
 * @typedef {Object} ApproachItem
 * @property {string} title
 * @property {string} description
 * @property {string} iconName
 */

/**
 * @typedef {Object} ProcessStep
 * @property {number} id
 * @property {string} title
 * @property {string} subtitle
 * @property {string} description
 * @property {string} iconName
 */

/**
 * @typedef {Object} TeamMember
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {string} description
 * @property {string} imageAlt
 * @property {string} bgColor
 */

/**
 * @typedef {Object} ServiceItem
 * @property {string} id
 * @property {string} title
 * @property {string} description
 */

/**
 * @typedef {Object} AccordionProps
 * @property {ServiceItem} item
 * @property {boolean} isOpen
 * @property {Function} onToggle
 */

export {};
