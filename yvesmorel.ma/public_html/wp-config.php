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
define( 'DB_NAME', 'u182232330_fkQsb' );

/** Database username */
define( 'DB_USER', 'u182232330_C2ibA' );

/** Database password */
define( 'DB_PASSWORD', 'uvu3l4fKrA' );

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
define( 'AUTH_KEY',          'M4=z!.A5R>;mcaCxxD5~k=@x:?KtDMW3-iW:PEj+.:,1 9D9#fof8v(%nI,6q&Rr' );
define( 'SECURE_AUTH_KEY',   '%lTBSGqTL.1<[{&rS5wRGNp[R&3p@v[uA6V;.c.*x0P&]!FVZfQKH!L5}HfZY+(k' );
define( 'LOGGED_IN_KEY',     '_!z(v1(xK.J5Q%qN{Gn7{nb} AW0o(A=)J*1+OlgJ(h1#C5{AJ?Q%$&Z,t4KLeak' );
define( 'NONCE_KEY',         '#V)Y)Q&-gv{v`MB3gO7xC&lts3x47AndB6a?h:!KrLNvUT.0{`3i$eNdS~6_6AS)' );
define( 'AUTH_SALT',         'dgu*RGsyXK@ m-sr1##O|-bgcpk Xi!5!l0;zd_FlCxUL*64`7<3=z<h-k3{+=5o' );
define( 'SECURE_AUTH_SALT',  'g~NTQsZD^q`}D)h%.=2<;|WX%y`>0R<p`wN*uGs%6d%Iz!}UrrL=80kSV| q1[lm' );
define( 'LOGGED_IN_SALT',    '[C%d8hrn`nry! x7B^:Q65]1+:A={G`fg;q)$]3xKU3+hr0)G*;Z@D0m_ab[]?^|' );
define( 'NONCE_SALT',        'E3m(~53SG16&:0rH)sz4k<%gx=z-#DD2w2VL=#b+Zi9jJ^#iaG$RjKtVeb!,BNnZ' );
define( 'WP_CACHE_KEY_SALT', 'k!E4q3<Y~v4?8{M_z T?j@vka!O0F{AkQLih2<$:Za==A)b1Ev C=1Dv99gYg-Yl' );


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
define( 'COOKIEHASH', 'ac7a826ebb67ca6b11c6780f3eb6f7df' );
define( 'WP_AUTO_UPDATE_CORE', 'minor' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
