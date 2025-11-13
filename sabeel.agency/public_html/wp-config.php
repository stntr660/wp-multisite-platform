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
define( 'DB_NAME', 'u182232330_pl6zk' );

/** Database username */
define( 'DB_USER', 'u182232330_EhqyW' );

/** Database password */
define( 'DB_PASSWORD', 'B658ZUL04b' );

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
define( 'AUTH_KEY',          'fZBD+j&p>/Hd|N|aMCR,zA+;8sUwbbH0i+`{J[*(>8AibQ`hmJR8D,_-T0%94AEa' );
define( 'SECURE_AUTH_KEY',   'mWFbo&;{5iza4p>7:^xM*n,RgHXWBru*hV!}&2Agr`O-VP_U7uTClIW/.}O)@&xW' );
define( 'LOGGED_IN_KEY',     'B)283sI{ZaUuX_8Q_({CaBH=~BD-LyT.jSoRg#~@?PI xYyL].X=[K6-9F_T;E$/' );
define( 'NONCE_KEY',         '1BuG(tmW9u,5CyT5jD(OgRM[EY#o<8JJzo#tP2metq[pK1asLf*!`-rIcbJfA5Sj' );
define( 'AUTH_SALT',         '5w$`*gfl|(3s}= >{/WuK UNp]v*;rucH=p7hnf-q6MxLwB5EzUS!}qSb@!=3js,' );
define( 'SECURE_AUTH_SALT',  'zHh<^cygL4[A#j>t=Te3B58x[4;n%Y{fjH)svU}oNG.0jTCZJ+m`B=2CpQZ`.8o:' );
define( 'LOGGED_IN_SALT',    'A@+fWNQK`)&GnX#RQps$M{X_WHx/;B1drk/O%#z.c:|wKb-Su80]9aj]sV#b7QYN' );
define( 'NONCE_SALT',        'm{+WPD>ftBmp:R,.,a76b;%X0i #[}Bz=,Ua2P$,H.u5HT1bv`Gi&,F^+d@U;/GM' );
define( 'WP_CACHE_KEY_SALT', ',2`s]1OmE-KkX6r+?)$7{DKgO`b!T[tg2im&YK0[/j1 Q*<5RZjW2j+z!a;rLe;`' );


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
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
