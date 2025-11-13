<?php
define( 'WP_CACHE', true );
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'u182232330_BVfGF' );

/** Database username */
define( 'DB_USER', 'u182232330_EuWtC' );

/** Database password */
define( 'DB_PASSWORD', 'm6qULIGso9' );

/** Database hostname */
define( 'DB_HOST', '127.0.0.1' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          '_([(+D.4;WyjU6]PUBTl}hAW`LW]Zh|7HuAyvzx[`)?OBV{F6G*^eLH>bhKc!(Rc' );
define( 'SECURE_AUTH_KEY',   'WK3K4C=VPQ9-. xd>IO5_Pn]~FqSv2eO u_(`X68?^k>1G)v;fT,a~hF!,,*~)o ' );
define( 'LOGGED_IN_KEY',     '~zUEd&mY5tp.C;C*}2u21#;B^k.fV+]Kl4bJuP-9.hN[[,{qADBh?_AK/A7R6@Vn' );
define( 'NONCE_KEY',         'qu.N*&*]ux9O*b[(x1#z$Gn*.>Ww@{RzOu!O M,HAyANO%&uR{1?f`J!ybgRh-IY' );
define( 'AUTH_SALT',         '[@2zoF+/5u_GgFrPGMI^@mpuO?w(7dW,THdc>|QRiq.5CA_&iXs1EmLTUQH+V:i|' );
define( 'SECURE_AUTH_SALT',  'B`GR0o8kBxMy5i_HU8_[scg(8pjiB062Y]xRdzLL))9&U.hY}oz[zP|; U$jl>pi' );
define( 'LOGGED_IN_SALT',    '0)gCfgG(VwT-.r;#TSHeJ?v.3nd_;(JnWoac?)T*UIP?oP6 8&no;gQQt$@HW9NX' );
define( 'NONCE_SALT',        'IcIbOR`Ca0/ntwQk0C?(PYW8(uvdc9?0E1|;${cv1nqNoPl&w|M3=Gi<HFV%{6`m' );
define( 'WP_CACHE_KEY_SALT', 'Sg19/L:{#2P/s,}I@QcYMN+oI[#w~&t2[kRMIut`wy&BAxMCWgeEupQ,<iTQ.4{w' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'FS_METHOD', 'direct' );
define( 'WP_AUTO_UPDATE_CORE', 'minor' );
define( 'WP_DEBUG_LOG', false );
define( 'WP_DEBUG_DISPLAY', false );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
