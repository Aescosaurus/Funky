// 
// STRUCTS
// 

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

// 
// FUNCTIONS
// 

const Log = ( msg ) =>
{
	console.log( msg );
}

const DrawRect = ( x,y,w,h,c ) =>
{
	cc.fillStyle = c;
	cc.fillRect( x,y,w,h,c );
}

const DrawRect2=( rect,c = "orange" )=>
{
	cc.strokeStyle = c;
	cc.lineWidth = 2;
	cc.strokeRect( rect.x,rect.y,rect.w,rect.h );
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

const Subtract=( vec1,vec2 )=>
{
	return Vec2( vec1.x - vec2.x,vec1.y - vec2.y );
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

const Clamp2D=( vec,minX,minY,maxX,maxY )=>
{
	return Vec2( Math.min( Math.max( minX,vec.x ),maxX ),
		Math.min( Math.max( minY,vec.y ),maxY ) );
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

const GetExpanded=( rect,amount )=>
{
	return Rect( rect.x - amount / 2,rect.y - amount / 2,
		rect.w + amount / 2,rect.h + amount / 2 );
}

const GetRectCenter=( rect )=>
{
	return Vec2( ( rect.x + rect.x + rect.w ) / 2,
		( rect.y + rect.y + rect.h ) / 2 );
}

// So I guess this is an impure function?
const LoadIntoArray=( source,rectSize,startPos )=>
{
	const dest = [];
	
	let x = startPos.x;
	let y = startPos.y;
	
	for( var i in source )
	{
		x += rectSize;
		if( source[i] == '1' )
		{
			dest.push( Rect( x,y,rectSize,rectSize ) );
			
			// console.log( x+" "+y );
		}
		else if( source[i] == 'n' )
		{ // New "line".
			y += rectSize;
			x = startPos.x;
		}
	}
	
	return dest;
}

const CreateRandomMap=( rectSize,startPos )=>
{
	const dest = [];
	
	const maxX = ScreenWidth + ScreenWidth * 0.75;
	const maxY = ScreenHeight + ScreenHeight * 0.75;
	
	for( var y = startPos.y; y < maxY; y += rectSize )
	{
		for( var x = startPos.x; x < maxX; x += rectSize )
		{
			if( x == startPos.x || y == startPos.y ||
				x == maxX - rectSize ||
				y == maxY - rectSize )
			{
				dest.push( Rect( x,y,rectSize,rectSize ) );
			}
			
			if( Math.random() < 0.1 )
			{
				dest.push( Rect( x,y,rectSize,rectSize ) );
			}
		}
	}
	
	return dest;
}

// I think this is an impure function.
const MoveAll=( arr,amount )=>
{
	for( var i in arr )
	{
		arr[i].x += amount.x;
		arr[i].y += amount.y;
	}
}

const GetLenSq=( vec )=>
{
	return( vec.x * vec.x + vec.y * vec.y );
}

const GetLen=( vec )=>
{
	return Math.sqrt( GetLenSq( vec ) );
}

const IsOverlap=( rect1,rect2 )=>
{
	return( rect1.x + rect1.w > rect2.x &&
		rect1.x < rect2.x + rect2.w &&
		rect1.y + rect1.h > rect2.y &&
		rect1.y < rect2.y + rect2.h );
}

const CheckOverlapForArr=( rect1,rectArr )=>
{
	for( var i in rectArr )
	{
		if( IsOverlap( rect1,rectArr[i] ) ) return true;
	}
	
	return false;
}

// 
// VARIABLES
// 

const canv = document.getElementById( "gc" );
const cc = canv.getContext( "2d" );

const ScreenWidth = canv.width;
const ScreenHeight = canv.height;

const fps = 30.0;

const keymap = [];

// const size = 32;
const plw = 32;
const plh = 32;
let player = Vec2( canv.width / 2 - plw / 2,
	canv.height / 2 - plh / 2 );
const hitbox = GetExpanded( Rect( player.x,player.y,
	plw,plw ),-( plw + 8 ) );
const hitboxAdd = Vec2( ( plw + 8 ) / 4,( plh + 8 ) / 2 );
let vel = Vec2( 0.0,0.0 );
let dir = Vec2( 1.0,1.0 );
const slowdown = 0.85;
const maxSpeed = 5.2;
const minClampArea = Vec2( 128,128 );
const maxClampArea = Vec2( ScreenWidth - minClampArea.x,
	ScreenHeight - minClampArea.y );

const bullets = [];
const bulletSize = 10.0;
const bulletSpeed = 12.2;
const refireTime = 0.2 * fps;
let shotTimer = 0.0;

let walls = [];
const wallSize = 32;

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

	// canv.height = window.innerHeight / 1.1;
	// canv.width = ScreenWidth *
	// 	( canv.height / ScreenHeight );
	// 
	// cc.scale( canv.width / ScreenWidth,
	// 	canv.height / ScreenHeight );
	
	// walls = LoadIntoArray( maps._1,wallSize,
	// 	Vec2( -ScreenWidth * 0.75,-ScreenHeight * 0.75 ) );
	walls = CreateRandomMap( wallSize,
		Vec2( -ScreenWidth * 0.75,-ScreenHeight * 0.75 ) );
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
	
	let moveAmount = Multiply( vel,-1 );
	MoveAll( walls,Multiply( vel,-1 ) );
	
	player = Add( player,vel );
	
	hitbox.x = player.x + hitboxAdd.x;
	hitbox.y = player.y + hitboxAdd.y;
	
	while( CheckOverlapForArr( hitbox,walls ) &&
		GetLen( vel ) > 0.01 )
	{
		player = Subtract( player,Multiply( vel,0.1 ) );
		hitbox.x = player.x + hitboxAdd.x;
		hitbox.y = player.y + hitboxAdd.y;
	}
	
	vel = Multiply( vel,slowdown );
	
	// console.log( Subtract( GetRectCenter( GetScreenArea() ),player ) );
	const offsetAmount = Divide( Subtract(
		GetRectCenter( GetScreenArea() ),GetCenter(
		player.x,player.y,plw,plh ) ),20 );
		
	moveAmount = Add( moveAmount,offsetAmount );
	MoveAll( walls,offsetAmount );
	player = Add( player,offsetAmount );
	
	player = Clamp2D( GetCenter( player.x,player.y,
		plw,plh ),
		minClampArea.x,minClampArea.y,
		maxClampArea.x,maxClampArea.y );
	player.x -= plw / 2;
	player.y -= plh / 2;
	
	// if( player.x < minClampArea.x ||
	// 	player.y < minClampArea.y ||
	// 	player.x > maxClampArea.x ||
	// 	player.y > maxClampArea.y )
	// {
	// 	vel = Multiply( vel,-1.0 );
	// }
	
	++shotTimer;
	const shotPos = GetCenter( player.x,player.y,
		plw,plh );

	if( ( look.x != 0.0 || look.y != 0.0 ) &&
		shotTimer > refireTime )
	{
		bullets.push( Bullet( shotPos.x - bulletSize / 2,
			shotPos.y - bulletSize / 2,dir ) );

		shotTimer = 0.0;
	}
	
	// MoveAll( walls,moveAmount );
	// MoveAll( walls,moveAmount );
	
	for( var i in bullets )
	{
		const temp = AddVel( bullets[i],
			bullets[i].d.x * bulletSpeed,
			bullets[i].d.y * bulletSpeed );
		
		bullets[i] = Bullet( temp.x,temp.y,bullets[i].d );
		
		const temp2 = Add( temp,moveAmount );
		bullets[i] = Bullet( temp2.x,temp2.y,bullets[i].d );
		
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
	
	for( var i in walls )
	{
		const w = walls[i];
		DrawRect( w.x,w.y,w.w,w.h,"gray" );
		DrawRect2( w );
	}
	
	DrawRect( player.x,player.y,
		plw,plh,"pink" );
	DrawRect2( Rect( hitbox.x,hitbox.y,
		hitbox.w,hitbox.h ),"cyan" );

	for( var i in bullets )
	{
		const b = bullets[i];
		DrawRect( b.x,b.y,bulletSize,bulletSize,"red" );
	}
}