using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoHBuilderJSONConverter
{
    public class PowerSetData
    {
        public string Description;
        public string SetName;
        public string FullName;
        public string ImageName;
        public int[] Power;
        public int SetType;
        public string DisplayName;
        public int nArchetype;
        public int nID;
        //public string UIDTrunkSet;
        //public int nUIDTrunkSet;
        public string UIDLinkSecondary;
        public int nUIDLinkSecondary;
        //public string UIDMutexSets;
        public int[] nIDMutexSets;
        public string GroupName;
        public string ShortName; // Added by me!
        public PowerData[] Powers;
    }

    public class PowerData
    {
        public double CastTimeReal;
        public double ToggleCost;
        public int PowerIndex;
        public int PowerSetID;
        public int StaticIndex;
        //public int[] NGroupMembership;
        public string FullName;
        public string GroupName;
        public string SetName;
        public string PowerName;
        public string DisplayName;
        public PowerDataRequires Requires;
        //public int ModesDisallowed;
        public double Accuracy;
        public double AccuracyMult;
        public int AttackTypes;
        public int EntitiesAffected;
        public int Target;
        public bool TargetLOS;
        public double Range;
        public double EndCost;
        public double RechargeTime;
        public double BaseRechargeTime;
        public int EffectArea;
        //public string MaxBoosts;
        public int NumAllowed;
        public string[] BoostsAllowed;
        public int[] Enhancements;
        public string DescShort;
        public string DescLong;
        //public bool SortOverride;
        public int[] SetTypes;
        public int Level;
        //public string VariableName;
        public int[] NIDSubPower;
        //public string[] UIDSubPower;
        public int[] IgnoreEnh;
        public int[] Ignore_Buff;
        //public bool MutexAuto;
        //public string ForcedClass;
        public PowerDataEffect[] Effects;
        public string FullSetName;
        public double CastTime;
        public bool Slottable;
        public double AoEModifier;
    }

    public class PowerDataRequires
    {
        //public string[] ClassName;
        //public string[] ClassNameNot;
        //public int[] NClassName;
        //public int[] NClassNameNot;
        public int[][] NPowerID;
        public int[][] NPowerIDNot;
        public string[][] PowerID;
        public string[][] PowerIDNot;
    }

    public class PowerDataEffect
    {
        public string MagnitudeExpression;
        public double Probability;
        public double Mag;
        public double MagPercent;
        public double BaseProbability;
        public string Reward;
        public string EffectId;
        public string Special;
        public int EffectType;
        public int DamageType;
        public string Summon;
        public int nSummon;
        public int Stacking;
        public bool Buffable;
        public bool Resistible;
        //public string UIDClassName;
        public int nIDClassName;
        public int pvMode;
        public int ToWho;
        public double Scale;
        public double nMagnitude;
        public int Aspect;
        //public string ModifierTable;
        public int nModifierTable;
        public string PowerFullName;
        public int Absorbed_PowerType;
        public int Absorbed_Power_nID;
        public int Absorbed_Class_nID;
        public int Absorbed_EffectID;
        public int UniqueID;
        public string Override;
        /*public double AtrOrigAccuracy;
        public double AtrOrigActivatePeriod;
        public int AtrOrigArc;
        public double AtrOrigCastTime;
        public double AtrOrigEnduranceCost;
        public double AtrOrigInterruptTime;
        public int AtrOrigMaxTargets;
        public double AtrOrigRadius;
        public double AtrOrigRechargeTime;
        public double AtrOrigSecondaryRange;
        public double AtrModAccuracy;
        public double AtrModActivatePeriod;
        public int AtrModArc;
        public double AtrModEnduranceCost;
        public double AtrModInterruptTime;
        public int AtrModMaxTargets;
        public double AtrModRadius;
        public double AtrModRange;
        public double AtrModRechargeTime;
        public double AtrModSecondaryRange;*/
        public PowerDataEffectActiveConditional[] ActiveConditionals; // TODO - Figure out this type!!!
        public int nOverride;
    }

    public class PowerDataEffectActiveConditional
    {
        public string Key;
        public string Value;
    }
}
