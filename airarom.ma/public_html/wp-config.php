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
define( 'DB_NAME', 'u182232330_WDskL' );

/** Database username */
define( 'DB_USER', 'u182232330_qbald' );

/** Database password */
define( 'DB_PASSWORD', 'x3HLfpQLeE' );

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
define( 'AUTH_KEY',          'ZoQXj`<cEtt1_=^oPYUT+]=w,|JCa4k!N-3g,4Y,4?/sIyWQWxO%.Mcs$:o,V15C' );
define( 'SECURE_AUTH_KEY',   'bgkHP^{z}O Q{)1a_[fWXk<(]XoWXMU2<Yv<|Os,iZZ?`4d|*%Wqt-v<+|KG ;,9' );
define( 'LOGGED_IN_KEY',     'Z_r$AQA$e)h8wf4b*|8@*w^LPeORknJa1XYfXsCy4w01LM-MK(5+4t$Yt+aH(FDC' );
define( 'NONCE_KEY',         '9!y4~8.a88b&O#dc&gR>k0,PTrK!<YooqC!1}[JKUi~yU6{E+y) S=[/Xb.&bHg*' );
define( 'AUTH_SALT',         'BQFzSiLLU8p~M37 s3B,X.-i>Z!t4F5/Vt*_6_+cXS1E<_ug!&/;VPhVfP 1fdJ*' );
define( 'SECURE_AUTH_SALT',  'eUc9*(yg|#_xth Ya!6uo]]t[5E#T^=y}5apbk]fm{Gr}Guq=c_D.swFt3&~6 +C' );
define( 'LOGGED_IN_SALT',    'E;sBiQluarXV7NY,lBKGayjov+%?ZJ43>S&22&fw5JG3<4LheZU biF}@|9.kFe5' );
define( 'NONCE_SALT',        'NU;z4@/S0o,Ul zYZeK@m mXqq(s@5{~v>bqk`|eTTxUUg*e[V0|Kb3jp)Sg;4p~' );
define( 'WP_CACHE_KEY_SALT', 'N++VfbVaguU=JqPK:m/XbrkBKvjo&O#Vgab!&DPNz+liJk<S )B`3DMU`0.Kb1}3' );


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
define( 'COOKIEHASH', '4a5a2bd014245a2a6202401b619196a2' );
define( 'WP_AUTO_UPDATE_CORE', 'minor' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
