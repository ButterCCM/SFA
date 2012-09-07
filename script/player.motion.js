﻿Player.prototype.isFacingLeft = function() { return this.Direction > 0; }
Player.prototype.getDistanceFromSq = function(x,y)
{
    var dx = x-this.getMidX();
    var dy = y-this.getMidY();

    var distSq = dx*dx + dy*dy;

    return distSq;
}
Player.prototype.getMidX = function()
{
    var left = this.getLeftX();
    var right = this.getRightX();

    return right - ((right-left)/2);
}
Player.prototype.getMidY = function()
{
    var bottom = this.getOffsetBoxBottom();
    var top = this.getBoxTop();

    return top - ((top-bottom)/2);
}

Player.prototype.getLeftX = function(useImageWidth) { if(this.Direction > 0){return STAGE.MAX_STAGEX - (this.getX() + (!!useImageWidth ? this.getBoxWidth() : this.getConstWidth()));}else{return this.getX();}}
Player.prototype.getRightX = function(useImageWidth)  { if(this.Direction > 0){return STAGE.MAX_STAGEX - this.getX();}else{return this.getX() + (!!useImageWidth ? this.getBoxWidth() : this.getConstWidth());}}
Player.prototype.getAbsFrontX = function(useImageWidth) { if(this.Direction > 0){ return this.getLeftX(useImageWidth); } else { return this.getRightX(useImageWidth); } }
Player.prototype.getAbsBackX = function(useImageWidth)  { if(this.Direction > 0){ return this.getRightX(useImageWidth); } else { return this.getLeftX(useImageWidth); } }

Player.prototype.getBoxTop = function() { return this.y_ + (this.getBoxHeight()); }
Player.prototype.getConstOffsetTop = function() { return this.Height + game_.Match.Stage.getGroundY(); }
Player.prototype.getOffsetBoxTop = function() { return this.y_ + (this.getBoxHeight()) + this.YTopOffset; }
Player.prototype.getBoxBottom = function() { return this.y_; }
Player.prototype.getOffsetBoxBottom = function() { return this.y_ + this.YBottomOffset; }
/*Player.prototype.getConstWidth = function() { return (!!this.CurrentAnimation && !!this.CurrentAnimation.Animation && !!this.CurrentAnimation.Animation.isAttack()) ? this.getBoxWidth() : this.Width; }*/
Player.prototype.getConstHeight = function() { return this.Height; }
Player.prototype.getConstWidth = function() { return this.Width; }
Player.prototype.getConstFrontX = function() { return this.getX() + this.getConstWidth(); }
Player.prototype.getFrontX = function() { return this.getX() + this.getBoxWidth(); }
Player.prototype.getBoxWidth = function() { return parseInt(this.Element.style.width); }
Player.prototype.getBoxHeight = function() { return parseInt(this.SpriteElement.style.height); }
Player.prototype.getRect = function(useImageWidth)
{
    return {Left:this.getLeftX(useImageWidth),Right:this.getRightX(useImageWidth),Top:this.getOffsetBoxTop(),Bottom:this.getOffsetBoxBottom()};
}
/*
Player.prototype.getRight = function() { return parseInt(this.Element.style.right || 0); }
Player.prototype.getLeft = function() { return parseInt(this.Element.style.left || 0); }
Player.prototype.getY = function() { return parseInt(this.Element.style.bottom) || 0; }
Player.prototype.getX = function() { if(this.Direction > 0){return this.getRight();} else {return this.getLeft();} }
*/
Player.prototype.getRight = function() { return this.x_; }
Player.prototype.getLeft = function() { return this.x_; }
Player.prototype.getY = function() { return this.y_ || 0; }
Player.prototype.getX = function() { return this.x_ || 0; }

Player.prototype.setRight = function(value) { this.Element.style.right = (value) + "px";}
Player.prototype.setLeft = function(value) { this.Element.style.left = (value) + "px";}

Player.prototype.setY = function(value)
{
    this.y_ = Math.max(value,game_.Match.Stage.getGroundY());
    this.moveCircle();
}
Player.prototype.setX = function(value)
{
    if(this.y_ == game_.Match.Stage.getGroundY())
        value = Math.min(Math.max(value,0),STAGE.MAX_STAGEX - (this.PendingWidth || 0));
    else
        value = Math.min(Math.max(value,0),STAGE.MAX_STAGEX - (this.PendingWidth || 0) * 0.8);
    this.x_ = value;
    this.moveCircle();
}
Player.prototype.show = function() { this.setDisplay(true); }
Player.prototype.hide = function() { this.setDisplay(false); }
Player.prototype.setDisplay = function(isVisible)
{
    if(!!isVisible)
    {
        this.Element.style.display = "";
        this.ShadowContainer.style.display = "";
    }
    else
    {
        this.Element.style.display = "none";
        this.ShadowContainer.style.display = "none";
    }
}
Player.prototype.alignX = function(deltaX) { this.x_ += (deltaX * -this.Direction); }

Player.prototype.setImageX = function(value) {if(this.Direction > 0){this.SpriteElement.style.right = value+"px"; } else {this.SpriteElement.style.left = value+"px";}}
Player.prototype.setImageY = function(value) { this.SpriteElement.style.bottom = value+"px"; }
Player.prototype.isCrouching = function() { return this.Flags.Pose.has(POSE_FLAGS.CROUCHING); }
Player.prototype.isOnGround = function() { return this.y_ == game_.Match.Stage.getGroundY(); }
Player.prototype.hasAirborneFlag = function() { return this.Flags.Pose.has(POSE_FLAGS.AIRBORNE) || this.Flags.Pose.has(POSE_FLAGS.AIRBORNE_FB) }
Player.prototype.hasAirborneComboFlag = function() { return this.Flags.Pose.has(POSE_FLAGS.AIR_COMBO_1) || this.Flags.Pose.has(POSE_FLAGS.AIR_COMBO_2); }
Player.prototype.isAirborne = function() { return this.hasAirborneComboFlag() || this.hasAirborneFlag() || this.y_ > game_.Match.Stage.getGroundY(); }
Player.prototype.alignY = function(groundY)
{
    if(this.y_ != groundY && !(this.hasAirborneFlag() || this.hasAirborneComboFlag()))
    {
        this.y_ = groundY;
    }
}
Player.prototype.isDescending = function() { return this.LastFrameY > this.ConstY; }
Player.prototype.isVisible = function() { return !this.Flags.Player.has(PLAYER_FLAGS.INVISIBLE); }
Player.prototype.isTeleporting = function() { return !!this.isTeleportingStarting() || !!this.isTeleportingEnding(); }
Player.prototype.isTeleportingStarting = function() { return !!this.CurrentAnimation && !!this.CurrentAnimation.Animation && !!(this.CurrentAnimation.Animation.Flags.Combat & COMBAT_FLAGS.TELEPORT_START); }
Player.prototype.isTeleportingEnding = function()   { return !!this.CurrentAnimation && !!this.CurrentAnimation.Animation && !!(this.CurrentAnimation.Animation.Flags.Combat & COMBAT_FLAGS.TELEPORT_END); }
Player.prototype.jumpedOverAPlayer = function() { return this.isAirborne() && this.isDescending() && !!this.MustChangeDirection; }
Player.prototype.canBeJuggled = function()
{
    return this.isAirborne()
        && !!this.CurrentAnimation.Animation
        && !!this.CurrentAnimation.Animation.AllowJuggle
    ;
}
Player.prototype.setDirection = function(value)
{
    if(value != this.Direction)
        this.changeDirection();
}
Player.prototype.turnAround = function()
{
    this.MustChangeDirection = 1;
}


Player.prototype.checkMustChangeDirection = function()
{
    if(!!this.MustChangeDirection && !this.isDead())
    {
        this.changeDirection();
    }
}

Player.prototype.changeDirection = function(quick)
{
    this.MustChangeDirection = 0;
    var pnlStageWidth = STAGE.CSSWIDTH;
    var imgWidth = parseInt(this.SpriteElement.style.width) || 0;


    /*facing left*/
    if(this.isFacingLeft())
    {
        var x = this.getRight() + imgWidth;
        var left = pnlStageWidth - x;
        this.setX(left);

        this.SpriteElement.style.right = "";
        this.SpriteElement.style.left = "0px";

        this.Element.style.right = "";
        this.Element.style.left = left + "px";

        this.ShadowContainer.style.right = "";
        this.ShadowContainer.style.left = left + "px";

        this.Shadow.style.left = this.SpriteElement.style.left;
        this.Shadow.style.right = "";

        this.Direction = -1;
        /*swap the left and right buttons*/
        this.Buttons[this.LeftKey].Bit = 2;
        this.Buttons[this.RightKey].Bit = 1;
        this.flip(true);
    }
    else
    {
        var x = this.getLeft() + imgWidth;
        var right = pnlStageWidth - x;
        this.setX(right);

        this.SpriteElement.style.left = "";
        this.SpriteElement.style.right = "0px";
        
        this.Element.style.left = "";
        this.Element.style.right = right + "px";

        this.ShadowContainer.style.left = "";
        this.ShadowContainer.style.right = right + "px";

        this.Shadow.style.left = "";
        this.Shadow.style.right = this.SpriteElement.style.right;

        this.Direction = 1;
        /*swap the left and right buttons*/
        this.Buttons[this.LeftKey].Bit = 1;
        this.Buttons[this.RightKey].Bit = 2;
        this.flip(false);
    }
    if(!quick)
    {
        if(this.Flags.Pose.has(POSE_FLAGS.CROUCHING))
        {
            var move = this.Moves[_c3("_",POSE_FLAGS.CROUCHING,"_turn")];
            this.setCurrentAnimation({Animation:move,StartFrame:game_.getCurrentFrame(),Direction:this.Direction});
        }
        else
        {
            var move = this.Moves[_c3("_",POSE_FLAGS.STANDING|POSE_FLAGS.WALKING_FORWARD|POSE_FLAGS.WALKING_BACKWARD,"_turn")];
            this.setCurrentAnimation({Animation:move,StartFrame:game_.getCurrentFrame(),Direction:this.Direction});
        }
    }

    for(var i = 0; i < this.KeyStates.length; ++i)
    {
        if(!!(this.KeyStates[i].Bit & (1 << 0)))
            this.KeyStates[i].Bit = this.KeyStates[i].Bit ^ (1 << 0) | (1 << 1);
        else if(!!(this.KeyStates[i].Bit & (1 << 1)))
            this.KeyStates[i].Bit = this.KeyStates[i].Bit ^ (1 << 1) | (1 << 0);
    }
    if(!!(this.KeyState & (1 << 0)))
        this.KeyState ^= (1 << 0) | (1 << 1);
    else if(!!(this.KeyState & (1 << 1)))
        this.KeyState ^= (1 << 1) | (1 << 0);
}
Player.prototype.moveCircleToBottom = function()
{
    this.moveCircle();
    this.Circle.RenderY = this.y_ + this.Circle.OffsetY;
}
Player.prototype.moveCircleToTop = function()
{
    this.moveCircle();
    this.Circle.RenderY = this.getBoxTop() - this.Circle.R*2 - this.Circle.OffsetY;
}
Player.prototype.moveCircle = function()
{
    var x = 0;
    if(this.Direction < 0)
        x = this.getX();
    else
        x = STAGE.MAX_STAGEX - this.getX();
    if(!!this.CurrentFrame && !!this.PendingWidth)
    {
        //this.Circle.R = (this.PendingWidth + (this.CurrentFrame.ImageOffsetX || 0)) / 2;
        //this.Circle.RSq = this.Circle.R * this.Circle.R;
    }
    if(this.Direction == -1)
        this.Circle.RenderX = x + this.Circle.R;
    else
        this.Circle.RenderX = x - this.Circle.R;


    this.Circle.LocalY = this.Circle.R;
    this.Circle.LocalX = this.Circle.R;

}
Player.prototype.moveY = function(amount,forced)
{
    var deltaY = this.moveYFn(amount,forced);
    var y = this.getY() + deltaY;
    this.setY(y);
    return deltaY;
}
Player.prototype.offsetImageX = function(amount)
{
    this.setImageX(amount);
}
Player.prototype.offsetImageY = function(amount)
{
    this.setImageY(amount);
}
/*sets the target to which the player will teleport*/
Player.prototype.setTeleportTarget = function(flag,nbFrames)
{
    var foe = this.getTarget();
    if(foe)
    {
        this.TeleportFramesLeft = nbFrames;
        this.Teleport0GapX = "";
        this.TeleportX = 0;
        switch(flag)
        {
            case COMBAT_FLAGS.TELEPORT_BEHIND:  { this.TeleportX = (STAGE.MAX_STAGEX - foe.x_) / nbFrames; this.Teleport0GapX = "b"; break; }
            case COMBAT_FLAGS.TELEPORT_INFRONT: { this.TeleportX = (STAGE.MAX_STAGEX - foe.x_ - foe.OffsetWidth - this.OffsetWidth) / nbFrames; this.Teleport0GapX = "f"; break; }
            case COMBAT_FLAGS.TELEPORT_MIDDLE:  { this.TeleportX = ((STAGE.MAX_STAGEX - foe.x_ - foe.OffsetWidth - this.OffsetWidth) / nbFrames)/2; this.Teleport0GapX = "m"; break; }
            case COMBAT_FLAGS.TELEPORT_BACK:    { this.TeleportX = (0 - this.x_) / nbFrames; this.Teleport0GapX = "bw"; break; }
        }
        this.TeleportX /= 2;
    }
}

/*Advances the players teleportation. If this is the last movement, the player is warper to his final position*/
Player.prototype.advanceTeleportation = function()
{
    if(!!this.TeleportFramesLeft)
    {
        var foe = this.getTarget();
        --this.TeleportFramesLeft;
        if(this.TeleportFramesLeft <= 0)
        {
            this.TeleportX = 0;
            if(!!(this.CurrentAnimation.Animation.Flags.Combat & COMBAT_FLAGS.TELEPORT_END) && !!this.Teleport0GapX)
            {
                if(foe)
                {
                    var otherRect = foe.getRect();
                    var buffer = 1.5;
                    var midBuffer = 0.35;
                    var x = this.x_;
                    switch(this.Teleport0GapX)
                    {
                        case "f": /*must end up infront of the enemy*/
                        {
                            x = this.Direction == -1 ? x = otherRect.Left - this.OffsetWidth * buffer : (STAGE.MAX_STAGEX - otherRect.Right) - this.OffsetWidth * buffer;
                            break;
                        }
                        case "b": /*must end up behind enemy*/
                        {
                            x = this.Direction == -1 ? x = otherRect.Right : x = STAGE.MAX_STAGEX - otherRect.Left;
                            break;
                        }
                        case "bw": /*back wall*/
                        {
                            x = 0;
                            break;
                        }
                        case "m": /*mid screen*/
                        {
                            x = this.Direction == -1 ? otherRect.Left * midBuffer : (STAGE.MAX_STAGEX - otherRect.Right) * midBuffer;
                            break;
                        }
                    }
                    this.setX(x);
                }
            }
        }
        else
        {
            if(!foe || !game_.Match.getPhysics().isWithinDistanceX(this,foe,CONSTANTS.MIN_TELEPORT_DISTANCE_SQ))
                this.moveX(this.TeleportX);
        }
    }
}

Player.prototype.getMustChangeDirection = function(recheck)
{
    if(!this.MustChangeDirection || !!recheck)
    {
        if((this.Direction == 1) && this.getPhysics().isAnyPlayerFromOtherTeamMoreLeft(this.getMidX(),this.Team) === false)
            return true;
        else if((this.Direction == -1) && this.getPhysics().isAnyPlayerFromOtherTeamMoreRight(this.getMidX(true),this.Team) === false)
            return true;
    }

    if(!!recheck)
        this.MustChangeDirection = false;

    return false;
}
Player.prototype.checkDirection = function()
{
    if(this.getMustChangeDirection())
        this.turnAround();
}
/*player faces his target*/
Player.prototype.faceTarget = function()
{
    var otherFront = 0;
    var otherBack = 0;

    var myFront = 0;
    var myBack = 0;


    if(this.Team == 1)
    {
        otherFront = this.getMatch().getTeamB().getPlayer(this.Target).getAbsFrontX();
        otherBack = this.getMatch().getTeamB().getPlayer(this.Target).getAbsBackX();

        myFront = this.getAbsFrontX();
        myBack = this.getAbsBackX();
    }
    else
    {
        otherFront = this.getMatch().getTeamA().getPlayer(this.Target).getAbsFrontX();
        otherBack = this.getMatch().getTeamA().getPlayer(this.Target).getAbsBackX();

        myFront = this.getAbsFrontX();
        myBack = this.getAbsBackX();
    }

    if((myFront < otherFront) && (this.Direction != -1) && (!this.MustChangeDirection))
        this.turnAround();
    else if((myBack > otherBack) && (this.Direction != 1) && (!this.MustChangeDirection))
        this.turnAround();
}
Player.prototype.targetLastAttacker = function()
{
    if(!!this.RegisteredHit.OtherPlayer)
    {
        this.Target = this.RegisteredHit.OtherPlayer.getIndex();
        this.faceTarget();
    }
}
/*moves the player in the stage*/
Player.prototype.moveX = function(amount)
{
    if(!amount)
        return 0;
    var x = this.getX();
    var deltaX = this.moveXFn(amount);
    x += deltaX;

    //this.setX(x);
    return deltaX;
}
/*warps the player to a new location - no collision detection is done*/
Player.prototype.warpX = function(amount,autoDir)
{
    if(!!autoDir)
    {
        if(amount > 0) /*moving right*/
        {
            if(this.Direction == -1)
                amount = Math.abs(amount);
            else
                amount = -Math.abs(amount);
        }
        else /*moving left*/
        {
            if(this.Direction == -1)
                amount = -Math.abs(amount);
            else
                amount = Math.abs(amount);
        }
    }
    var oldX = this.getMidX();
    this.setX(this.x_ + amount);
    return this.getMidX() - oldX;
}

Player.prototype.warpY = function(amount)
{
    var oldY = this.y_;
    this.setY(this.y_ + amount);

    return this.y_ - oldY;
}

Player.prototype.convertX = function(x)
{
    if(this.Direction < 0)
        return STAGE.MAX_STAGEX - this.getBoxWidth() - x
    else
        return STAGE.MAX_STAGEX - this.getBoxWidth() - x;
}

Player.prototype.convertY = function(y)
{
    return y;
}
Player.prototype.isLeftCornered = function(x)
{
    var rect = this.getRect();
    return rect.Left <= STAGE.MIN_X;

    x = x || this.getX();
    var retVal = false;
    if(this.Direction < 0 && x <= STAGE.MIN_X)
        retVal = true;
    else if(this.Direction > 0 && x >= STAGE.MAX_STAGEX - (this.PendingWidth || 0))
        retVal = true;
    return retVal;
}
Player.prototype.isLeftCorneredInStage = function(x)
{
    return this.isLeftCornered() && this.getStage().isLeftCornered();
}
Player.prototype.isRightCornered = function(x)
{
    var rect = this.getRect();
    return rect.Right >= STAGE.MAX_STAGEX;

    x = x || this.getX();
    var retVal = false;
    if(this.Direction < 0 && x >= STAGE.MAX_STAGEX - (this.PendingWidth || 0))
        retVal = true;
    else if(this.Direction > 0 && x <= STAGE.MIN_X)
        retVal = true;
    return retVal;
}
Player.prototype.isRightCorneredInStage = function(x)
{
    return this.isRightCornered() && this.getStage().isRightCornered();
}
/*Shows the dirt animation when a player is floored*/
Player.prototype.showBigDirt = function(frame)
{
    for(var i = 0; i < 4; ++i)
    {
        this.spawnBigDirt(frame,i * 40);
    }
}
/*Shows the small dirt animation when a player is floored*/
Player.prototype.showSmallDirt = function(frame)
{
    for(var i = 0; i < 4; ++i)
    {
        this.spawnSmallDirt(frame,20 + (i * 30));
    }
}
/*Puts a player in sliding motion*/
Player.prototype.startSlide = function(frame,amount,direction,fx,hideSlideDirt,forceSlide)
{
    if(!forceSlide && !!this.CurrentAnimation.Animation.Flags.Combat && !!(this.CurrentAnimation.Animation.Flags.Combat & COMBAT_FLAGS.NO_SLIDE_BACK))
        return this.stopSlide();

    if(this.IsSliding)
    {
        this.t_ = 0;
        this.Fx = Math.sin(this.t_) * amount;
    }

    if(!!hideSlideDirt)
        this.ShowSlideDirt = false;

    if((this.Direction > 0 && direction < 0) || (this.Direction < 0 && direction > 0))
        this.SlideFactor = Math.abs(amount) * fx;
    else if((this.Direction > 0 && direction > 0) || (this.Direction < 0 && direction < 0))
        this.SlideFactor = -Math.abs(amount) * fx;

    this.SlideSpeed = fx;
    this.IsSliding = true;
}
/*Handles the player sliding*/
Player.prototype.slide = function(frame)
{
    if(!!this.FrameFreeze && !this.isBlocking())
        return;
    if(this.t_ >= CONSTANTS.HALF_PI || !this.IsSliding || !!this.isBeingGrappled())
    {
        this.stopSlide();
        return;
    }
    this.t_ = Math.min(this.t_ + (CONSTANTS.SLIDE_INC), CONSTANTS.HALF_PI);
    this.LastFx = this.Fx;
    this.Fx =  Math.sin(this.t_) * this.SlideFactor;
    ++this.SlideCount;

    if(!!this.ShowSlideDirt)
    {
        if(this.SlideCount % CONSTANTS.DIRT_FREQUENCY == 0)
        {
            this.spawnSmallDirt(frame);
        }
    }

    var deltaX = (this.LastFx - this.Fx);
    
    if(this.isOnGround())
        this.moveX(deltaX);
    else
        this.SlideFactor *= 0.5;
    
}

Player.prototype.stopSlide = function()
{
    if(!!this.IsSliding)
    {
        this.t_ = 0;
        this.Fx = 0;
        this.SlideCount = 0;
        this.IsSliding = false;
        this.ShowSlideDirt = true;
    }
}

/*returns true if the player should hold its airborne position*/
Player.prototype.mustHoldAirborne = function() { return this.Flags.Pose.has(POSE_FLAGS.FORCE_HOLD_AIRBORNE_XY) || this.Flags.Pose.has(POSE_FLAGS.HOLD_AIRBORNE); }

/*calculates the next position of the players jump*/
Player.prototype.advanceJump = function(ignoreYCheck)
{
    //this.x1 = this.X0 + ((this.JumpVelocityX * this.JumpT) * 0.1);
    var y = this.Y0 + ((this.JumpVelocityY * this.JumpT) - ((CONSTANTS.HALF_G*this.Mass) * (this.JumpT*this.JumpT))) * CONSTANTS.Y_DAMPING;

    if(this.mustHoldAirborne())
    {
        this.holdJump();
        if(this.Flags.Pose.has(POSE_FLAGS.FORCE_HOLD_AIRBORNE_XY))
            return true;
    }

    this.JumpT += this.JumpSpeed_;

    var dx = this.JumpVelocityX * CONSTANTS.X_DAMPING * this.JumpSpeed_;
    var dy = y - this.OldY;

    if(!!this.vxFn)
        dx = this.vxFn(dx,this.JumpT);
    if(!!this.vyFn)
        dy = this.vyFn(dy,this.JumpT);

    this.OldY = y;

    this.moveX(dx);
    this.moveY(dy);

    if(!ignoreYCheck && this.getY() <= game_.Match.Stage.getGroundY())
    {
        this.clearAirborneFlags();
        this.vxFn = null;
        this.vyFn = null;
        this.JumpT = 0;
        return false;
    }
    return true;
}

Player.prototype.clearAirborneFlags = function()
{
    this.Flags.Pose.remove(POSE_FLAGS.AIR_COMBO_2);
    this.Flags.Pose.remove(POSE_FLAGS.AIR_COMBO_1);
    this.Flags.Pose.remove(POSE_FLAGS.AIRBORNE);
    this.Flags.Pose.remove(POSE_FLAGS.AIRBORNE_FB);
}


Player.prototype.performJump = function(vx,vy,vxFn,vyFn,jumpT,deltaY,useJumpSpeed)
{
    this.JumpSpeed_ = !!useJumpSpeed ? this.JumpSpeed : 1;

    /*store the X and Y modifier functions*/
    this.setVxFn(vxFn);
    this.setVyFn(vyFn);
    /*store the initial position*/
    this.X0 = this.x_;
    this.Y0 = this.y_ + (deltaY || 0);
    this.OldY = this.y_ + (deltaY || 0);
    this.JumpVelocityX = vx;
    this.JumpVelocityY = vy;
    this.JumpT = jumpT || 0;
    /*store the velocity*/
    /*store a timer*/
    if(!this.hasAirborneComboFlag())
    {
        if(!!vx)
        {
            this.Flags.Pose.add(POSE_FLAGS.AIRBORNE_FB);
        }
        else
        {
            this.Flags.Pose.add(POSE_FLAGS.AIRBORNE);
        }
    }
    this.advanceJump(true);
}

Player.prototype.stopJump = function()
{
    this.performJump(this.JumpVelocityX,0);
}


Player.prototype.holdJump = function()
{
    if(this.Flags.Pose.has(POSE_FLAGS.FORCE_HOLD_AIRBORNE_XY) || (!!this.JumpT && !!this.CanHoldAirborne))
    {
        this.JumpT -= this.JumpSpeed;
    }
}

Player.prototype.setVyFn = function(fn) { this.vyFn = this.vyFn || fn; }
Player.prototype.setVxFn = function(fn) { this.vxFn = this.vxFn || fn; }

Player.prototype.resetVyFn = function(fn) { this.vyFn = function(b) { return b;} }
Player.prototype.resetVxFn = function(fn) { this.vxFn = function(b) { return b;} }

Player.prototype.clearVyFn = function() { this.vyFn = null; }
Player.prototype.clearVxFn = function() { this.vxFn = null; }

Player.prototype.flip = function(isFlipped)
{
    this.IsFlipped = isFlipped;
    ApplyFlip(this.SpriteElement,isFlipped);
}