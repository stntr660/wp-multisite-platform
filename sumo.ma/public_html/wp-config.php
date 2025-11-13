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
define( 'DB_NAME', 'u182232330_VBue9' );

/** Database username */
define( 'DB_USER', 'u182232330_gVpPS' );

/** Database password */
define( 'DB_PASSWORD', 'P7DLRJKWmU' );

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
define( 'AUTH_KEY',          'q#dPLxbF>FjZZquJWPSTk%ji,`%J?IAV;cbR^r;kvTCbzwLiS0x<w}4NE/[r~O:)' );
define( 'SECURE_AUTH_KEY',   'i4lb:tLB B_GDIsbWJ1:QnN.~Flgq6;)sK6>3^7-Nj(u6uO0E)jBNDFnX73=q0P(' );
define( 'LOGGED_IN_KEY',     'V*1xKx_`<Y<QfdLq(:mujp#QyH sraC1J,-~m%c/]h)eVX3x`c.!KWN39G2[.Yr&' );
define( 'NONCE_KEY',         '>bvel!3bOo:I5kx1ZtK/mW]_)`#817gk-aMNd*_Kup jpIsn%/f>KPz+|!WL@_Pv' );
define( 'AUTH_SALT',         'ZaCDr)P;[J9uhPC*OlLkq{+yPn`ilbbZvAfRe.tXfuaW?lgwnHI )t]2eY6m3pZ.' );
define( 'SECURE_AUTH_SALT',  ':(AXOqpB(GN[2D*s7pb/Y^rmUGDW9mu}C?;w<?qu8{*[e|:bE|], RhWl 3gE3`=' );
define( 'LOGGED_IN_SALT',    'kAHp;P/C<0zbYp63,!DDet:,g/@[@X-i2hm[eQk-t^)d2*#O)7TfgTO-sTF<]YJ@' );
define( 'NONCE_SALT',        '9})kwH:=syeqTPO^wQ62V0 ^K_]lt [Qn;Go<Y~Fqi{{iXsJYys?p^k;|MB1wn^y' );
define( 'WP_CACHE_KEY_SALT', '`r0v^#Z ith6rv9GYByiDF2@y7gm$68sk-3_B6BzAX4-S]ys5Oq3XR.7w=HVS[Fw' );


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
define( 'COOKIEHASH', '4b289bbf949c8e001f9b32263d5ad6df' );
define( 'WP_AUTO_UPDATE_CORE', 'minor' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
