class Vec2_
{
	constructor( x,y )
	{
		this.x = x;
		this.y = y;
	}
}
const Vec2 = ( x,y ) =>
{
	return ( new Vec2_( x,y ) );
}

class Bullet_ extends Vec2_
{
	constructor( x,y,d )
	{
		super( x,y );
		this.d = d; // d = dir
	}
}
const Bullet = ( x,y,d ) =>
{
	return ( new Bullet_( x,y,d ) );
}

class Rect_ extends Vec2_
{
	constructor( x,y,w,h )
	{
		super( x,y );
		this.w = w;
		this.h = h;
	}
}
const Rect = ( x,y,w,h ) =>
{
	return ( new Rect_( x,y,w,h ) );
}

const canv = document.getElementById( "gc" );
const cc = canv.getContext( "2d" );

const ScreenWidth = canv.width;
const ScreenHeight = canv.height;

const fps = 30.0;

const keymap = [];

const size = 32;
let player = {
	x: canv.width / 2 - size / 2,
	y: canv.height / 2 - size / 2
};
let vel = Vec2( 0.0,0.0 );
let dir = Vec2( 1.0,1.0 );
const slowdown = 0.85;
const maxSpeed = 5.2;

const bullets = [];
const bulletSize = 10.0;
const bulletSpeed = 12.2;
const refireTime = 0.2 * fps;
let shotTimer = 0.0;

const walls = [];
const wallSize = 32;

const Log = ( msg ) =>
{
	console.log( msg );
}

const DrawRect = ( x,y,w,h,c ) =>
{
	cc.fillStyle = c;
	cc.fillRect( x,y,w,h,c );
}

const Code = ( char ) =>
{
	return ( char.charCodeAt( 0 ) );
}

const IsDown = ( keycode ) =>
{
	return ( keymap[keycode] );
}

const AmountDown = ( keycode ) =>
{
	return ( IsDown( keycode ) ? 1 : 0 );
}

const KeyDelta = ( kc1,kc2 ) =>
{
	return -( AmountDown( kc1 ) - AmountDown( kc2 ) );
}

const CharDelta = ( char1,char2 ) =>
{
	return KeyDelta( Code( char1 ),Code( char2 ) );
}

const AddVel = ( vel,xAmount,yAmount ) =>
{
	// return { x: vel.x + xAmount,y: vel.y + yAmount };
	return Vec2( vel.x + xAmount,vel.y + yAmount );
}

const Add = ( vec1,vec2 ) =>
{
	// return ( { x: vec1.x + vec2.x,y: vec1.y + vec2.y } );
	return Vec2( vec1.x + vec2.x,vec1.y + vec2.y );
}

const Multiply = ( vec,amount ) =>
{
	// return ( { x: vec.x * amount,y: vec.y * amount } );
	return Vec2( vec.x * amount,vec.y * amount );
}

const Divide = ( vec,amount ) =>
{
	return Vec2( vec.x / amount,vec.y / amount );
}

const Clamp = ( vec,min,max ) =>
{
	// return {
	// 	x: Math.min( Math.max( min,vec.x ),max ),
	// 	y: Math.min( Math.max( min,vec.y ),max )
	// };
	return Vec2( Math.min( Math.max( min,vec.x ),max ),
		Math.min( Math.max( min,vec.y ),max ) );
}

const Normalize = ( vec ) =>
{
	const len = Math.sqrt( vec.x * vec.x + vec.y * vec.y );

	return ( len != 0.0
		? Multiply( vec,1.0 / len )
		: Vec2( 0.0,0.0 ) );
}

const GetCenter = ( x,y,width,height ) =>
{
	// return { x: x + width / 2,y: y + height / 2 };
	return Vec2( x + width / 2,y + height / 2 );
}

const IsContainedBy = ( rect1,rect2 ) =>
{
	return ( rect1.x > rect2.x && rect1.y > rect2.y &&
		rect1.x + rect1.w < rect2.x + rect2.w &&
		rect1.y + rect1.h < rect2.y + rect2.h );
}

const GetScreenArea = () =>
{
	return Rect( 0.0,0.0,ScreenWidth,ScreenHeight );
}

window.onload = () =>
{
	Start();
	setInterval( () =>
	{
		UpdateGame();
		DrawFrame();
	},1000 / fps );

	onkeydown = onkeyup = ( e ) =>
	{
		keymap[e.keyCode] = ( e.type == "keydown" );
	}
}

const Start = () =>
{
	// const offset = 1.25;
	// canv.width *= offset;
	// canv.height *= offset;

	canv.height = window.innerHeight / 1.1;
	canv.width = ScreenWidth *
		( canv.height / ScreenHeight );

	cc.scale( canv.width / ScreenWidth,
		canv.height / ScreenHeight );
}

const UpdateGame = () =>
{
	const move = Normalize( Vec2( CharDelta( 'A','D' ),
		CharDelta( 'W','S' ) ) );
	const look = Normalize( Vec2( KeyDelta( 37,39 ),
		KeyDelta( 38,40 ) ) );
	
	const aim = Normalize( Add( look,
		Divide( vel,maxSpeed ) ) );

	dir = ( aim.x != 0.0 || aim.y != 0.0 ) ? aim : dir;

	vel = AddVel( vel,move.x,move.y );

	vel = Clamp( vel,-maxSpeed,maxSpeed );

	player = Add( player,vel );
	vel = Multiply( vel,slowdown );

	++shotTimer;
	const shotPos = GetCenter( player.x,player.y,
		size,size );

	if( ( look.x != 0.0 || look.y != 0.0 ) &&
		shotTimer > refireTime )
	{
		bullets.push( Bullet( shotPos.x - bulletSize / 2,
			shotPos.y - bulletSize / 2,dir ) );

		shotTimer = 0.0;
	}

	for( var i in bullets )
	{
		const temp = AddVel( bullets[i],
			bullets[i].d.x * bulletSpeed,
			bullets[i].d.y * bulletSpeed );

		bullets[i] = Bullet( temp.x,temp.y,bullets[i].d );

		const b = bullets[i];

		if( !IsContainedBy( Rect( b.x,b.y,
			bulletSize,bulletSize ),
			GetScreenArea() ) )
		{
			bullets.splice( i,1 );
		}
	}
}

const DrawFrame = () =>
{
	DrawRect( 0,0,canv.width,canv.height,"black" );

	DrawRect( player.x,player.y,
		size,size,"orange" );

	for( var i in bullets )
	{
		const b = bullets[i];
		DrawRect( b.x,b.y,bulletSize,bulletSize,"red" );
	}
}