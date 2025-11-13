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
define( 'DB_NAME', 'u182232330_SRazs' );

/** Database username */
define( 'DB_USER', 'u182232330_ZjLrj' );

/** Database password */
define( 'DB_PASSWORD', 'YDLHAaxrKu' );

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
define( 'AUTH_KEY',          ']Q20Sf|hp=[L{=F)uG`_e~m^BSr(MDAfliF[mEpFAmR}fky}rQ&_&7<&fK V25O.' );
define( 'SECURE_AUTH_KEY',   'R)+D7M%`Vfa :OWi62yZ4]r<&UZt3?*=3d9(_)VeUto896.lG%5E* >9KHg|Srm5' );
define( 'LOGGED_IN_KEY',     'TJbVC/eYSLHMW5ZTjqx0lm2%.8/%hDaQ`pa&G`hmR;;fagIwTgi=L.Yq4hRty~Y%' );
define( 'NONCE_KEY',         'Cp1Fp9.;nsV9U4XG_q_M|&xVBE}/uhkWi~b6h05yc.tqT0*#=EVGBh&bR[@kC|%d' );
define( 'AUTH_SALT',         ',<0tE#!9DYZi@6L$eyJ=C>KmEa _GU8cdjPD;ESKmktoQ!?S^~V6Xv%biA4B@vAW' );
define( 'SECURE_AUTH_SALT',  'sv+_LZXL@Bi9[|36Y~0lJ{]SAi%#{*FyChM9ku<!2Ph`gFu&JgI,:2T{e,DFNsnY' );
define( 'LOGGED_IN_SALT',    'KDo;tp4(JM&W3zTc;7u}`Qr6Bt}EB=P]-S==9Iwdcx$4/n==e?{AXC@lu^Ow2as`' );
define( 'NONCE_SALT',        'b2$n*>YdWHbMRuNg/{QY$+8qtD{y35LriMYeK;.DTjKF)hXA|BgXe|MsCstgX~+,' );
define( 'WP_CACHE_KEY_SALT', '_X:I%2omrd_+Xas?P^?)2Ayms+pU%/uXWg-!N36<Fm!3NjeL]&g/)UN:iO?$cUQ$' );


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
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', true );

define( 'FS_METHOD', 'direct' );
define( 'COOKIEHASH', '13b47f948ef62b7afdb374f8d0068fcf' );
define( 'WP_AUTO_UPDATE_CORE', true );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
